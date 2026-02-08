import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { readProjectFile, writeProjectFile, listProjectFiles } from '@/lib/git'
import Anthropic from '@anthropic-ai/sdk'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })
    const { id } = await params
    const project = await prisma.project.findFirst({ where: { id, userId: session.userId }, include: { conversations: { orderBy: { createdAt: 'desc' }, take: 1, include: { messages: { orderBy: { createdAt: 'asc' } } } } } })
    if (!project) return NextResponse.json({ error: '项目不存在' }, { status: 404 })
    const conversation = project.conversations[0]
    return NextResponse.json({ messages: conversation?.messages.map(m => ({ role: m.role, content: m.content })) || [] })
  } catch (error) { console.error('Get chat error:', error); return NextResponse.json({ error: '获取聊天记录失败' }, { status: 500 }) }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })
    const { id } = await params
    const { message } = await request.json()
    if (!message) return NextResponse.json({ error: '缺少消息内容' }, { status: 400 })
    const project = await prisma.project.findFirst({ where: { id, userId: session.userId }, include: { conversations: { orderBy: { createdAt: 'desc' }, take: 1, include: { messages: { orderBy: { createdAt: 'asc' } } } } } })
    if (!project) return NextResponse.json({ error: '项目不存在' }, { status: 404 })
    const settings = await prisma.settings.findUnique({ where: { userId: session.userId } })
    const apiKey = settings?.claudeApiKey || process.env.ANTHROPIC_API_KEY
    if (!apiKey) return NextResponse.json({ error: '请先配置 Claude API Key' }, { status: 400 })
    let conversation = project.conversations[0]
    if (!conversation) conversation = await prisma.conversation.create({ data: { projectId: project.id }, include: { messages: true } })
    const files = await listProjectFiles(project.localPath)
    const systemPrompt = `你是前端开发助手，帮助开发项目"${project.name}"。项目文件：${files.slice(0,50).join(', ')}。用<read_file path="路径"/>读取文件，<write_file path="路径">内容</write_file>写入文件。中文回复。`
    const historyMessages = conversation.messages.map(m => ({ role: m.role as 'user'|'assistant', content: m.content }))
    historyMessages.push({ role: 'user', content: message })
    await prisma.message.create({ data: { conversationId: conversation.id, role: 'user', content: message } })
    const anthropic = new Anthropic({ apiKey })
    const response = await anthropic.messages.create({ model: 'claude-sonnet-4-20250514', max_tokens: 4096, system: systemPrompt, messages: historyMessages })
    let assistantMessage = response.content[0].type === 'text' ? response.content[0].text : ''
    const readMatches = assistantMessage.matchAll(/<read_file path="([^"]+)"\s*\/>/g)
    for (const match of readMatches) { try { const content = await readProjectFile(project.localPath, match[1]); assistantMessage = assistantMessage.replace(match[0], '```\n'+content+'\n```') } catch { assistantMessage = assistantMessage.replace(match[0], '[读取失败]') } }
    const writeMatches = assistantMessage.matchAll(/<write_file path="([^"]+)">([\s\S]*?)<\/write_file>/g)
    for (const match of writeMatches) { try { await writeProjectFile(project.localPath, match[1], match[2]); assistantMessage = assistantMessage.replace(match[0], '[已写入:'+match[1]+']') } catch { assistantMessage = assistantMessage.replace(match[0], '[写入失败]') } }
    await prisma.message.create({ data: { conversationId: conversation.id, role: 'assistant', content: assistantMessage } })
    return NextResponse.json({ message: assistantMessage })
  } catch (error) { console.error('Chat error:', error); return NextResponse.json({ error: 'AI 响应失败' }, { status: 500 }) }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })
    const { id } = await params
    const project = await prisma.project.findFirst({ where: { id, userId: session.userId } })
    if (!project) return NextResponse.json({ error: '项目不存在' }, { status: 404 })
    await prisma.conversation.deleteMany({ where: { projectId: project.id } })
    return NextResponse.json({ success: true })
  } catch (error) { console.error('Clear chat error:', error); return NextResponse.json({ error: '清除聊天记录失败' }, { status: 500 }) }
}
