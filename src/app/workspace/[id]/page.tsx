'use client';

import { useState, useEffect, useRef, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Send, Loader2, GitBranch, Plus, Shield } from 'lucide-react';
import Link from 'next/link';
import { ChatMessage } from '@/components/chat/chat-message';

interface Branch {
  name: string;
  default: boolean;
  protected: boolean;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface Project {
  id: number;
  name: string;
  gitlab_project_id: number;
  current_branch: string;
}

export default function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [creatingBranch, setCreatingBranch] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.status === 401) { router.push('/login'); return; }
      if (!res.ok) return;
      const data = await res.json();
      setProject(data);
      setCurrentBranch(data.current_branch);
    } catch (error) {
      console.error('Failed to fetch project:', error);
    }
  }, [projectId, router]);

  const fetchBranches = useCallback(async () => {
    if (!project?.gitlab_project_id) return;
    try {
      const res = await fetch(`/api/gitlab/branches?projectId=${project.gitlab_project_id}`);
      if (!res.ok) return;
      const data = await res.json();
      setBranches(data);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    }
  }, [project?.gitlab_project_id]);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/chat`);
      if (!res.ok) return;
      const data = await res.json();
      setMessages((data.messages || []).map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })));
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, [projectId]);

  useEffect(() => { fetchProject(); fetchMessages(); }, [fetchProject, fetchMessages]);
  useEffect(() => { if (project?.gitlab_project_id) fetchBranches(); }, [project, fetchBranches]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, streamingText]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }]);
    setLoading(true);
    setStreamingText('');

    try {
      const res = await fetch(`/api/projects/${projectId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'assistant', content: `错误: ${data.error}`, timestamp: new Date() }]);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'token') {
              fullText += data.text;
              setStreamingText(fullText);
            } else if (data.type === 'done') {
              fullText = data.fullText || fullText;
            } else if (data.type === 'error') {
              fullText = `错误: ${data.error}`;
            }
          } catch {
            continue;
          }
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: fullText, timestamp: new Date() }]);
      setStreamingText('');
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '网络错误', timestamp: new Date() }]);
      setStreamingText('');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBranch = async () => {
    if (!newBranchName.trim() || !project?.gitlab_project_id) return;
    setCreatingBranch(true);
    try {
      const res = await fetch('/api/gitlab/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.gitlab_project_id, branchName: newBranchName, ref: currentBranch }),
      });
      if (res.ok) { await fetchBranches(); setCurrentBranch(newBranchName); setNewBranchName(''); setDialogOpen(false); }
    } catch (error) {
      console.error('Failed to create branch:', error);
    } finally {
      setCreatingBranch(false);
    }
  };

  const isProtectedBranch = (branchName: string) => branchName === 'main' || branchName === 'master';

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur flex-shrink-0">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold text-white">{project?.name || '加载中...'}</h1>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 border-r border-slate-700 p-4 flex flex-col gap-4 flex-shrink-0">
          <div className="space-y-2">
            <Label className="text-sm text-slate-400">分支</Label>
            <Select value={currentBranch} onValueChange={setCurrentBranch}>
              <SelectTrigger>
                <SelectValue placeholder="选择分支" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.name} value={branch.name}>
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-3 w-3" />
                      <span>{branch.name}</span>
                      {isProtectedBranch(branch.name) && <Shield className="h-3 w-3 text-yellow-500" />}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isProtectedBranch(currentBranch) && (
            <Badge variant="outline" className="text-yellow-500 border-yellow-500">
              <Shield className="h-3 w-3 mr-1" /> 受保护分支
            </Badge>
          )}

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-2" />新建分支</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>新建分支</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>分支名称</Label>
                  <Input value={newBranchName} onChange={(e) => setNewBranchName(e.target.value)} placeholder="feature/new-feature" />
                </div>
                <p className="text-sm text-muted-foreground">基于 <code className="bg-slate-800 px-1 rounded">{currentBranch}</code> 创建</p>
                <Button onClick={handleCreateBranch} disabled={creatingBranch || !newBranchName.trim()}>
                  {creatingBranch ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}创建
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.length === 0 && !streamingText && (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-lg mb-2">你好！我是你的 AI 助手</p>
                  <p>告诉我你想对这个项目做什么修改</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <ChatMessage key={i} role={msg.role} content={msg.content} timestamp={msg.timestamp} />
              ))}
              {streamingText && (
                <ChatMessage role="assistant" content={streamingText} isStreaming />
              )}
              {loading && !streamingText && (
                <div className="flex items-center gap-2 text-slate-400 text-sm px-4">
                  <Loader2 className="h-4 w-4 animate-spin" /> AI 正在思考...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t border-slate-700 p-4 flex-shrink-0">
            <div className="max-w-3xl mx-auto flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="描述你想要的修改..."
                className="min-h-[60px] resize-none"
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              />
              <Button onClick={handleSend} disabled={loading || !input.trim()} size="icon" className="h-[60px] w-[60px]">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="w-96 border-l border-slate-700 flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-slate-700">
            <h3 className="text-sm font-medium text-slate-400">预览</h3>
          </div>
          <div className="flex-1 bg-slate-950 flex items-center justify-center">
            <p className="text-slate-500 text-sm">项目预览区域</p>
          </div>
        </div>
      </div>
    </div>
  );
}
