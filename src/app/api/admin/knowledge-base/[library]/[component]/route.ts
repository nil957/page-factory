import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import * as fs from 'fs'
import * as path from 'path'

const KB_DIR = path.join(process.cwd(), 'knowledge-base')

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ library: string; component: string }> }
) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })

    const { library, component } = await params
    const filePath = path.join(KB_DIR, library, `${component}.md`)

    try {
      const content = fs.readFileSync(filePath, 'utf8')
      return NextResponse.json({ content })
    } catch {
      return NextResponse.json({ content: '' })
    }
  } catch (error) {
    console.error('Read doc error:', error)
    return NextResponse.json({ error: '读取文档失败' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ library: string; component: string }> }
) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })

    const { library, component } = await params
    const { content } = await request.json()

    if (typeof content !== 'string') {
      return NextResponse.json({ error: '缺少 content 字段' }, { status: 400 })
    }

    const dir = path.join(KB_DIR, library)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, `${component}.md`), content, 'utf8')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Write doc error:', error)
    return NextResponse.json({ error: '保存文档失败' }, { status: 500 })
  }
}
