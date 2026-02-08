import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })
    const { id } = await params
    const project = await prisma.project.findFirst({ where: { id, userId: session.userId } })
    if (!project) return NextResponse.json({ error: '项目不存在' }, { status: 404 })
    return NextResponse.json({ project })
  } catch (error) { console.error('Get project error:', error); return NextResponse.json({ error: '获取项目失败' }, { status: 500 }) }
}
