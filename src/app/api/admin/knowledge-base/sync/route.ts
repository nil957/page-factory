import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { execSync } from 'child_process'
import * as path from 'path'

const SCRIPTS: Record<string, string> = {
  'udesign-pro': 'sync-pro.ts',
  'common-components': 'sync-common.ts',
  'udesign': 'sync-udesign.ts',
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })

    const { library } = await request.json()
    const script = SCRIPTS[library]
    if (!script) {
      return NextResponse.json({ error: `不支持的库: ${library}` }, { status: 400 })
    }

    const scriptPath = path.join('knowledge-base', 'scripts', script)
    const tsconfigPath = path.join('knowledge-base', 'scripts', 'tsconfig.json')
    const cmd = `npx ts-node --project ${tsconfigPath} ${scriptPath}`

    const output = execSync(cmd, {
      cwd: process.cwd(),
      timeout: 120000,
      env: { ...process.env, GITLAB_TOKEN: process.env.GITLAB_TOKEN || '' },
      encoding: 'utf8',
    })

    return NextResponse.json({ success: true, output })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('Sync error:', msg)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
