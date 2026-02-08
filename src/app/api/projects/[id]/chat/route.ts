import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { readProjectFile, writeProjectFile, listProjectFiles } from '@/lib/git'
import Anthropic from '@anthropic-ai/sdk'
import { searchComponents, getComponentDoc, buildComponentContext } from '@/lib/knowledge-base'

const LOOKUP_COMPONENT_TOOL: Anthropic.Tool = {
  name: 'lookup_component',
  description: '查看某个组件的完整文档，包括 Props 定义、用法示例和注意事项。当需要准确使用某个组件时调用此工具。',
  input_schema: {
    type: 'object' as const,
    properties: {
      component_name: {
        type: 'string',
        description: '组件名称，如 ProTable, RegionZone, Button'
      },
      library: {
        type: 'string',
        enum: ['udesign', 'udesign-pro', 'common-components'],
        description: '组件所属库（可选，不确定时可省略）'
      }
    },
    required: ['component_name']
  }
}

function detectProjectType(files: string[]): 'console' | 'standalone' {
  return files.some(f => f.startsWith('.console/') || f.includes('dependences.js'))
    ? 'console'
    : 'standalone'
}

function buildSystemPrompt(
  projectName: string,
  projectType: 'console' | 'standalone',
  files: string[],
  userMessage: string
): string {
  const relevantComponents = searchComponents(userMessage, projectType, 8)
  const componentContext = relevantComponents.length > 0
    ? buildComponentContext(relevantComponents, projectType)
    : '暂无匹配的组件，可使用 lookup_component 工具查询。'

  return `你是 Page Factory AI 助手，帮助开发项目"${projectName}"（${projectType === 'console' ? '控制台' : '独立'}项目）。

## 项目文件
${files.slice(0, 30).join(', ')}

## 可用组件
${componentContext}

## 规则
1. 始终使用上面列出的组件和 import 语句
2. 如果组件有冲突标记，严格按冲突规则使用
3. common-components 组件仅限控制台项目使用
4. 如需查看组件详细文档，使用 lookup_component 工具
5. 用中文回复

## 文件操作
- 用 <read_file path="路径"/> 读取项目文件
- 用 <write_file path="路径">内容</write_file> 写入文件`
}

function handleToolUse(
  toolName: string,
  input: Record<string, unknown>,
  projectType: 'console' | 'standalone'
): string {
  if (toolName !== 'lookup_component') {
    return `未知工具: ${toolName}`
  }

  const componentName = input.component_name as string
  const library = input.library as string | undefined

  const matches = searchComponents(componentName, projectType, 5)
  const exact = matches.find(c =>
    c.name === componentName && (!library || c.library === library)
  )

  if (exact) {
    const doc = getComponentDoc(exact.docFile)
    return doc || `组件 ${componentName} 的详细文档暂未生成。基本信息：\n${exact.import}\n${exact.description}`
  }

  if (matches.length > 0) {
    const suggestions = matches.map(c => `- ${c.name} (${c.library})`).join('\n')
    return `未找到精确匹配 "${componentName}"，相似组件：\n${suggestions}`
  }

  return `未找到组件 "${componentName}"。请检查组件名是否正确。`
}

function extractTextFromResponse(response: Anthropic.Message): string {
  return response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map(block => block.text)
    .join('')
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })
    const { id } = await params
    const project = await prisma.project.findFirst({ 
      where: { id, userId: session.userId }, 
      include: { 
        conversations: { 
          orderBy: { createdAt: 'desc' }, 
          take: 1, 
          include: { messages: { orderBy: { createdAt: 'asc' } } } 
        } 
      } 
    })
    if (!project) return NextResponse.json({ error: '项目不存在' }, { status: 404 })
    const conversation = project.conversations[0]
    if (!conversation) {
      return NextResponse.json({ messages: [] })
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msgs = (conversation as any).messages || []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messages = msgs.map((m: any) => ({ role: m.role, content: m.content }))
    return NextResponse.json({ messages })
  } catch (error) { 
    console.error('Get chat error:', error)
    return NextResponse.json({ error: '获取聊天记录失败' }, { status: 500 }) 
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })
    const { id } = await params
    const { message } = await request.json()
    if (!message) return NextResponse.json({ error: '缺少消息内容' }, { status: 400 })
    const project = await prisma.project.findFirst({ 
      where: { id, userId: session.userId }, 
      include: { 
        conversations: { 
          orderBy: { createdAt: 'desc' }, 
          take: 1, 
          include: { messages: { orderBy: { createdAt: 'asc' } } } 
        } 
      } 
    })
    if (!project) return NextResponse.json({ error: '项目不存在' }, { status: 404 })
    const settings = await prisma.settings.findUnique({ where: { userId: session.userId } })
    const apiKey = settings?.claudeApiKey || process.env.ANTHROPIC_API_KEY
    if (!apiKey) return NextResponse.json({ error: '请先配置 Claude API Key' }, { status: 400 })
    
    let conversation = project.conversations[0]
    if (!conversation) {
      conversation = await prisma.conversation.create({ 
        data: { projectId: project.id }, 
        include: { messages: true } 
      })
    }
    
    const files = await listProjectFiles(project.localPath)
    const projectType = detectProjectType(files)
    const systemPrompt = buildSystemPrompt(project.name, projectType, files, message)
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msgs = (conversation as any).messages || []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const historyMessages: Anthropic.MessageParam[] = msgs.map((m: any) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    }))
    historyMessages.push({ role: 'user', content: message })
    
    await prisma.message.create({ data: { conversationId: conversation.id, role: 'user', content: message } })
    
    const anthropic = new Anthropic({ apiKey })
    let response = await anthropic.messages.create({ 
      model: 'claude-sonnet-4-20250514', 
      max_tokens: 4096, 
      system: systemPrompt, 
      messages: historyMessages,
      tools: [LOOKUP_COMPONENT_TOOL]
    })
    
    const MAX_TOOL_ITERATIONS = 3
    let iterations = 0
    while (response.stop_reason === 'tool_use' && iterations < MAX_TOOL_ITERATIONS) {
      const toolUseBlock = response.content.find(
        (c): c is Anthropic.ToolUseBlock => c.type === 'tool_use'
      )
      if (!toolUseBlock) break

      const toolResult = handleToolUse(
        toolUseBlock.name,
        toolUseBlock.input as Record<string, unknown>,
        projectType
      )

      historyMessages.push({ role: 'assistant', content: response.content })
      historyMessages.push({
        role: 'user',
        content: [{
          type: 'tool_result',
          tool_use_id: toolUseBlock.id,
          content: toolResult
        }]
      })

      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: systemPrompt,
        messages: historyMessages,
        tools: [LOOKUP_COMPONENT_TOOL]
      })
      iterations++
    }
    
    let assistantMessage = extractTextFromResponse(response)
    
    const readMatches = assistantMessage.matchAll(/<read_file path="([^"]+)"\s*\/>/g)
    for (const match of readMatches) { 
      try { 
        const content = await readProjectFile(project.localPath, match[1])
        assistantMessage = assistantMessage.replace(match[0], '```\n'+content+'\n```') 
      } catch { 
        assistantMessage = assistantMessage.replace(match[0], '[读取失败]') 
      } 
    }
    
    const writeMatches = assistantMessage.matchAll(/<write_file path="([^"]+)">([\s\S]*?)<\/write_file>/g)
    for (const match of writeMatches) { 
      try { 
        await writeProjectFile(project.localPath, match[1], match[2])
        assistantMessage = assistantMessage.replace(match[0], '[已写入:'+match[1]+']') 
      } catch { 
        assistantMessage = assistantMessage.replace(match[0], '[写入失败]') 
      } 
    }
    
    await prisma.message.create({ data: { conversationId: conversation.id, role: 'assistant', content: assistantMessage } })
    return NextResponse.json({ message: assistantMessage })
  } catch (error) { 
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'AI 响应失败' }, { status: 500 }) 
  }
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
  } catch (error) { 
    console.error('Clear chat error:', error)
    return NextResponse.json({ error: '清除聊天记录失败' }, { status: 500 }) 
  }
}
