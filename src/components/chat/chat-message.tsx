'use client'

import { MessageContent } from './message-content'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
  isStreaming?: boolean
}

export function ChatMessage({ role, content, timestamp, isStreaming }: ChatMessageProps) {
  const isUser = role === 'user'

  const formatTime = (date?: Date) => {
    if (!date) return ''
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return '刚刚'
    if (mins < 60) return `${mins}分钟前`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}小时前`
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg flex-shrink-0 bg-slate-700">
        {isUser ? '👤' : '🤖'}
      </div>
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-slate-500">{isUser ? '你' : 'AI 助手'}</span>
          {timestamp && <span className="text-xs text-slate-600">{formatTime(timestamp)}</span>}
        </div>
        <div className={`rounded-lg px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-blue-600/20 text-slate-200'
            : 'bg-slate-800 text-slate-200'
        }`}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <MessageContent content={content} />
          )}
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-blue-400 animate-pulse ml-1" />
          )}
        </div>
      </div>
    </div>
  )
}
