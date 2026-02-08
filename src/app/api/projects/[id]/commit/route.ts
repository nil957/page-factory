import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { commitAndPush, getCurrentBranch } from '@/lib/git'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })
    const { id } = await params
    const { message } = await request.json()
    if (!message) return NextResponse.json({ error: '缺少提交信息' }, { status: 400 })
    const project = await prisma.project.findFirst({ where: { id, userId: session.userId } })
    if (!project) return NextResponse.json({ error: '项目不存在' }, { status: 404 })
    const currentBranch = await getCurrentBranch(project.localPath)
    if (['main', 'master'].includes(currentBranch)) return NextResponse.json({ error: '不能直接提交到受保护的分支' }, { status: 400 })
    const settings = await prisma.settings.findUnique({ where: { userId: session.userId } })
    if (!settings?.gitlabAccessToken) return NextResponse.json({ error: '请先配置 GitLab 设置' }, { status: 400 })
    await commitAndPush(project.localPath, message, settings.gitlabAccessToken)
    return NextResponse.json({ success: true })
  } catch (error) { console.error('Commit error:', error); return NextResponse.json({ error: '提交失败' }, { status: 500 }) }
}
