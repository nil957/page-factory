import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ user: null })
    return NextResponse.json({ user: { id: session.userId, username: session.username } })
  } catch { return NextResponse.json({ user: null }) }
}
