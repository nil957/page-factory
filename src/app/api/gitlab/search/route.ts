import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { searchGitLabProjects } from '@/lib/gitlab'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    if (!query) return NextResponse.json({ projects: [] })
    const settings = await prisma.settings.findUnique({ where: { userId: session.userId } })
    if (!settings?.gitlabUrl || !settings?.gitlabAccessToken) return NextResponse.json({ error: '请先配置 GitLab 设置' }, { status: 400 })
    const projects = await searchGitLabProjects(settings.gitlabUrl, settings.gitlabAccessToken, query)
    return NextResponse.json({ projects })
  } catch (error) { console.error('Search GitLab projects error:', error); return NextResponse.json({ error: '搜索项目失败' }, { status: 500 }) }
}
