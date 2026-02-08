import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    if (!username || !password) return NextResponse.json({ error: '用户名和密码不能为空' }, { status: 400 })
    const existingUser = await prisma.user.findUnique({ where: { username } })
    if (existingUser) return NextResponse.json({ error: '用户名已存在' }, { status: 400 })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { username, passwordHash } })
    await prisma.settings.create({ data: { userId: user.id } })
    const token = await signToken({ userId: user.id, username: user.username })
    const response = NextResponse.json({ user: { id: user.id, username: user.username } })
    response.cookies.set('token', token, { httpOnly: true, secure: process.env.COOKIE_SECURE === 'true', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 })
    return response
  } catch (error) { console.error('Registration error:', error); return NextResponse.json({ error: '注册失败' }, { status: 500 }) }
}
