import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getGitLabBranches, createGitLabBranch } from '@/lib/gitlab'
import { checkoutBranch, pullBranch, getCurrentBranch } from '@/lib/git'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })
    const { id } = await params
    const project = await prisma.project.findFirst({ where: { id, userId: session.userId } })
    if (!project) return NextResponse.json({ error: '项目不存在' }, { status: 404 })
    const settings = await prisma.settings.findUnique({ where: { userId: session.userId } })
    if (!settings?.gitlabUrl || !settings?.gitlabAccessToken) return NextResponse.json({ error: '请先配置 GitLab 设置' }, { status: 400 })
    const branches = await getGitLabBranches(settings.gitlabUrl, settings.gitlabAccessToken, project.gitlabProjectId)
    const currentBranch = await getCurrentBranch(project.localPath)
    return NextResponse.json({ branches: branches.map(b => ({ name: b.name, protected: b.protected, default: b.default })), currentBranch })
  } catch (error) { console.error('Get branches error:', error); return NextResponse.json({ error: '获取分支列表失败' }, { status: 500 }) }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })
    const { id } = await params
    const { action, branchName, ref } = await request.json()
    const project = await prisma.project.findFirst({ where: { id, userId: session.userId } })
    if (!project) return NextResponse.json({ error: '项目不存在' }, { status: 404 })
    const settings = await prisma.settings.findUnique({ where: { userId: session.userId } })
    if (!settings?.gitlabUrl || !settings?.gitlabAccessToken) return NextResponse.json({ error: '请先配置 GitLab 设置' }, { status: 400 })
    if (action === 'checkout') { await checkoutBranch(project.localPath, branchName); await pullBranch(project.localPath); return NextResponse.json({ success: true }) }
    if (action === 'create') { await createGitLabBranch(settings.gitlabUrl, settings.gitlabAccessToken, project.gitlabProjectId, branchName, ref); await checkoutBranch(project.localPath, branchName); return NextResponse.json({ success: true }) }
    return NextResponse.json({ error: '无效的操作' }, { status: 400 })
  } catch (error) { console.error('Branch operation error:', error); return NextResponse.json({ error: '分支操作失败' }, { status: 500 }) }
}
