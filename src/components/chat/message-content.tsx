'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useState } from 'react'

export function MessageContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          const codeString = String(children).replace(/\n$/, '')

          if (match) {
            return <CodeBlock language={match[1]} code={codeString} />
          }

          return (
            <code className="px-1.5 py-0.5 rounded bg-slate-700 text-sm font-mono" {...props}>
              {children}
            </code>
          )
        },
        table({ children }) {
          return (
            <div className="overflow-x-auto my-2">
              <table className="min-w-full border border-slate-600 text-sm">{children}</table>
            </div>
          )
        },
        th({ children }) {
          return <th className="border border-slate-600 px-3 py-1.5 bg-slate-700 text-left font-medium">{children}</th>
        },
        td({ children }) {
          return <td className="border border-slate-600 px-3 py-1.5">{children}</td>
        },
        p({ children }) {
          return <p className="mb-2 last:mb-0">{children}</p>
        },
        ul({ children }) {
          return <ul className="list-disc pl-5 mb-2">{children}</ul>
        },
        ol({ children }) {
          return <ol className="list-decimal pl-5 mb-2">{children}</ol>
        },
        h1({ children }) { return <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1> },
        h2({ children }) { return <h2 className="text-lg font-bold mt-3 mb-2">{children}</h2> },
        h3({ children }) { return <h3 className="text-base font-bold mt-2 mb-1">{children}</h3> },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group my-2">
      <div className="flex items-center justify-between px-3 py-1 bg-slate-900 rounded-t text-xs text-slate-400">
        <span>{language}</span>
        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
        >
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        customStyle={{ margin: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0, fontSize: '0.8125rem' }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
