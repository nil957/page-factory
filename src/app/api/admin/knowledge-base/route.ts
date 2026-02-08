import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import * as fs from 'fs'
import * as path from 'path'

const KB_DIR = path.join(process.cwd(), 'knowledge-base')

interface RegistryComponent {
  name: string
  library: string
  docFile: string
  hasConflict: boolean
}

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })

    const registry = JSON.parse(fs.readFileSync(path.join(KB_DIR, 'registry.json'), 'utf8'))
    const components: RegistryComponent[] = registry.components

    const result = components.map(c => {
      const fullPath = path.join(KB_DIR, c.docFile)
      let hasDoc = false
      let lineCount = 0
      try {
        const content = fs.readFileSync(fullPath, 'utf8')
        hasDoc = true
        lineCount = content.split('\n').length
      } catch {
        hasDoc = false
      }
      return {
        library: c.library,
        component: c.name,
        docFile: c.docFile,
        hasDoc,
        lineCount,
        hasConflict: c.hasConflict,
      }
    })

    return NextResponse.json({ components: result })
  } catch (error) {
    console.error('List KB error:', error)
    return NextResponse.json({ error: '获取组件列表失败' }, { status: 500 })
  }
}
