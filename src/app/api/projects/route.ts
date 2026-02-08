import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cloneRepository } from '@/lib/git'
import { getGitLabProject } from '@/lib/gitlab'
import fs from 'fs/promises'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })
    const projects = await prisma.project.findMany({ where: { userId: session.userId }, orderBy: { updatedAt: 'desc' } })
    return NextResponse.json({ projects })
  } catch (error) { console.error('Get projects error:', error); return NextResponse.json({ error: '获取项目列表失败' }, { status: 500 }) }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })
    const { gitlabProjectId } = await request.json()
    if (!gitlabProjectId) return NextResponse.json({ error: '缺少项目ID' }, { status: 400 })
    const existing = await prisma.project.findUnique({ where: { userId_gitlabProjectId: { userId: session.userId, gitlabProjectId } } })
    if (existing) return NextResponse.json({ project: existing })
    const settings = await prisma.settings.findUnique({ where: { userId: session.userId } })
    if (!settings?.gitlabUrl || !settings?.gitlabAccessToken) return NextResponse.json({ error: '请先配置 GitLab 设置' }, { status: 400 })
    const gitlabProject = await getGitLabProject(settings.gitlabUrl, settings.gitlabAccessToken, gitlabProjectId)
    const project = await prisma.project.create({ data: { userId: session.userId, gitlabProjectId, name: gitlabProject.name, description: gitlabProject.description, localPath: '', gitlabUrl: gitlabProject.web_url, defaultBranch: gitlabProject.default_branch } })
    const localPath = await cloneRepository(gitlabProject.http_url_to_repo, settings.gitlabAccessToken, session.userId, project.id)
    const updatedProject = await prisma.project.update({ where: { id: project.id }, data: { localPath } })
    return NextResponse.json({ project: updatedProject })
  } catch (error) { console.error('Import project error:', error); return NextResponse.json({ error: '导入项目失败' }, { status: 500 }) }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('id')
    if (!projectId) return NextResponse.json({ error: '缺少项目ID' }, { status: 400 })
    const project = await prisma.project.findFirst({ where: { id: projectId, userId: session.userId } })
    if (!project) return NextResponse.json({ error: '项目不存在' }, { status: 404 })
    try { await fs.rm(project.localPath, { recursive: true, force: true }) } catch {}
    await prisma.project.delete({ where: { id: projectId } })
    return NextResponse.json({ success: true })
  } catch (error) { console.error('Delete project error:', error); return NextResponse.json({ error: '删除项目失败' }, { status: 500 }) }
}
