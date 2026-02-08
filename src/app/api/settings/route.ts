import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })
    const settings = await prisma.settings.findUnique({ where: { userId: session.userId } })
    return NextResponse.json({
      settings: settings ? { gitlabUrl: settings.gitlabUrl || '', gitlabAccessToken: settings.gitlabAccessToken ? '***' : '', claudeApiKey: settings.claudeApiKey ? '***' : '' } : { gitlabUrl: '', gitlabAccessToken: '', claudeApiKey: '' }
    })
  } catch (error) { console.error('Get settings error:', error); return NextResponse.json({ error: '获取设置失败' }, { status: 500 }) }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })
    const { gitlabUrl, gitlabAccessToken, claudeApiKey } = await request.json()
    const updateData: Record<string, string> = {}
    if (gitlabUrl !== undefined) updateData.gitlabUrl = gitlabUrl
    if (gitlabAccessToken && gitlabAccessToken !== '***') updateData.gitlabAccessToken = gitlabAccessToken
    if (claudeApiKey && claudeApiKey !== '***') updateData.claudeApiKey = claudeApiKey
    await prisma.settings.upsert({ where: { userId: session.userId }, create: { userId: session.userId, ...updateData }, update: updateData })
    return NextResponse.json({ success: true })
  } catch (error) { console.error('Update settings error:', error); return NextResponse.json({ error: '保存设置失败' }, { status: 500 }) }
}
