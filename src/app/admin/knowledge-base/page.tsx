'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ComponentEntry {
  library: string
  component: string
  docFile: string
  hasDoc: boolean
  lineCount: number
  hasConflict: boolean
}

const LIBRARY_LABELS: Record<string, string> = {
  'udesign': 'UDesign',
  'udesign-pro': 'UDesign-Pro',
  'common-components': 'Common Components',
}

export default function KnowledgeBasePage() {
  const [components, setComponents] = useState<ComponentEntry[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<ComponentEntry | null>(null)
  const [docContent, setDocContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch('/api/admin/knowledge-base')
      .then(r => r.json())
      .then(d => setComponents(d.components || []))
  }, [])

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSelect = async (entry: ComponentEntry) => {
    setSelected(entry)
    try {
      const res = await fetch(`/api/admin/knowledge-base/${entry.library}/${entry.component}`)
      const data = await res.json()
      setDocContent(data.content || '')
    } catch {
      setDocContent('')
    }
  }

  const handleSave = async () => {
    if (!selected) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/knowledge-base/${selected.library}/${selected.component}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: docContent }),
      })
      if (res.ok) {
        showToast('success', '保存成功')
        setComponents(prev => prev.map(c =>
          c.library === selected.library && c.component === selected.component
            ? { ...c, hasDoc: true, lineCount: docContent.split('\n').length }
            : c
        ))
      } else {
        showToast('error', '保存失败')
      }
    } catch {
      showToast('error', '网络错误')
    } finally {
      setSaving(false)
    }
  }

  const handleSync = async (library: string) => {
    setSyncing(library)
    try {
      const res = await fetch('/api/admin/knowledge-base/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ library }),
      })
      const data = await res.json()
      if (data.success) {
        showToast('success', `${LIBRARY_LABELS[library]} 同步完成`)
        const listRes = await fetch('/api/admin/knowledge-base')
        const listData = await listRes.json()
        setComponents(listData.components || [])
      } else {
        showToast('error', `同步失败: ${data.error}`)
      }
    } catch {
      showToast('error', '同步请求失败')
    } finally {
      setSyncing(null)
    }
  }

  const filtered = components.filter(c =>
    !search || c.component.toLowerCase().includes(search.toLowerCase())
  )

  const grouped = ['udesign', 'udesign-pro', 'common-components'].map(lib => ({
    library: lib,
    label: LIBRARY_LABELS[lib],
    items: filtered.filter(c => c.library === lib),
  }))

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm">&larr; 返回</Link>
          <h1 className="text-lg font-bold">知识库管理</h1>
        </div>
        <div className="flex items-center gap-2">
          {['udesign', 'udesign-pro', 'common-components'].map(lib => (
            <button
              key={lib}
              onClick={() => handleSync(lib)}
              disabled={syncing !== null}
              className="text-xs px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50 transition-colors"
            >
              {syncing === lib ? '同步中...' : `同步 ${LIBRARY_LABELS[lib]}`}
            </button>
          ))}
        </div>
      </header>

      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded text-sm ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toast.text}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 border-r border-slate-700 flex flex-col overflow-hidden">
          <div className="p-3">
            <input
              type="text"
              placeholder="搜索组件..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {grouped.map(group => (
              <div key={group.library}>
                <button
                  className="w-full px-3 py-2 text-left text-sm font-medium text-slate-300 hover:bg-slate-800 flex items-center justify-between"
                  onClick={() => setCollapsed(prev => ({ ...prev, [group.library]: !prev[group.library] }))}
                >
                  <span>{group.label} ({group.items.length})</span>
                  <span className="text-xs">{collapsed[group.library] ? '+' : '-'}</span>
                </button>
                {!collapsed[group.library] && group.items.map(item => (
                  <button
                    key={`${item.library}-${item.component}`}
                    className={`w-full px-4 py-1.5 text-left text-sm flex items-center gap-2 hover:bg-slate-800 ${
                      selected?.library === item.library && selected?.component === item.component
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-400'
                    }`}
                    onClick={() => handleSelect(item)}
                  >
                    <span className="truncate flex-1">{item.component}</span>
                    {item.hasConflict && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-900/50 text-red-300">冲突</span>
                    )}
                    {!item.hasDoc && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-600 text-slate-400">无文档</span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          {selected ? (
            <>
              <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">{selected.component}</span>
                  <span className="text-xs text-slate-500 ml-2">{selected.docFile}</span>
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-500 rounded disabled:opacity-50 transition-colors"
                >
                  {saving ? '保存中...' : '保存'}
                </button>
              </div>
              <textarea
                value={docContent}
                onChange={e => setDocContent(e.target.value)}
                className="flex-1 p-4 bg-slate-800 text-sm font-mono resize-none focus:outline-none"
                spellCheck={false}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              从左侧选择一个组件来编辑文档
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
