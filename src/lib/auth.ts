import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'page-factory-secret-key')

export interface JWTPayload { userId: string; username: string }

export async function signToken(payload: JWTPayload) { return new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('7d').setIssuedAt().sign(JWT_SECRET) }
export async function verifyToken(token: string): Promise<JWTPayload | null> { try { const { payload } = await jwtVerify(token, JWT_SECRET); return payload as unknown as JWTPayload } catch { return null } }
export async function getSession(): Promise<JWTPayload | null> { const cookieStore = await cookies(); const token = cookieStore.get('token')?.value; if (!token) return null; return verifyToken(token) }
export async function requireAuth() { const session = await getSession(); if (!session) throw new Error('Unauthorized'); return session }
