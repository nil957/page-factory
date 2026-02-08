'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, LogOut, FolderPlus, FolderOpen, Loader2, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Project {
  id: string;
  name: string;
  description: string | null;
  gitlabUrl: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', template: 'console' });
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleCreate = async () => {
    if (!newProject.name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });
      if (res.ok) {
        const data = await res.json();
        setDialogOpen(false);
        setNewProject({ name: '', description: '', template: 'console' });
        router.push(`/workspace/${data.project.id}`);
      }
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('确定删除此项目？本地文件将被清除。')) return;
    setDeleting(projectId);
    try {
      await fetch(`/api/projects?id=${projectId}`, { method: 'DELETE' });
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } finally {
      setDeleting(null);
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return '刚刚';
    if (mins < 60) return `${mins}分钟前`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}天前`;
    return d.toLocaleDateString('zh-CN');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Page Factory</h1>
          <div className="flex items-center gap-2">
            <Link href="/admin/knowledge-base">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                知识库管理
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">欢迎使用 Page Factory</h2>
          <p className="text-slate-400 text-lg">AI 驱动的低代码开发平台</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:border-primary transition-colors group">
                <CardHeader className="text-center py-12">
                  <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <FolderPlus className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">新建项目</CardTitle>
                  <CardDescription className="text-base">
                    创建新项目并推送到 GitLab
                  </CardDescription>
                </CardHeader>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新建项目</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-1 block">项目名称</label>
                  <Input
                    placeholder="my-console-app"
                    value={newProject.name}
                    onChange={e => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-1 block">描述（可选）</label>
                  <Input
                    placeholder="项目描述"
                    value={newProject.description}
                    onChange={e => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-1 block">项目模板</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        newProject.template === 'console'
                          ? 'border-primary bg-primary/10 text-white'
                          : 'border-slate-600 text-slate-400 hover:border-slate-500'
                      }`}
                      onClick={() => setNewProject(prev => ({ ...prev, template: 'console' }))}
                    >
                      <div className="font-medium">控制台项目</div>
                      <div className="text-xs mt-1 opacity-70">含 .console 配置 + 组件依赖</div>
                    </button>
                    <button
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        newProject.template === 'blank'
                          ? 'border-primary bg-primary/10 text-white'
                          : 'border-slate-600 text-slate-400 hover:border-slate-500'
                      }`}
                      onClick={() => setNewProject(prev => ({ ...prev, template: 'blank' }))}
                    >
                      <div className="font-medium">空白项目</div>
                      <div className="text-xs mt-1 opacity-70">仅初始化 README</div>
                    </button>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={handleCreate}
                  disabled={creating || !newProject.name.trim()}
                >
                  {creating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      创建中...
                    </>
                  ) : (
                    '创建项目'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Link href="/import">
            <Card className="cursor-pointer hover:border-primary transition-colors group h-full">
              <CardHeader className="text-center py-12">
                <div className="mx-auto mb-4 p-4 rounded-full bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                  <FolderOpen className="h-12 w-12 text-emerald-500" />
                </div>
                <CardTitle className="text-2xl">已有项目</CardTitle>
                <CardDescription className="text-base">
                  从 GitLab 导入现有项目
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
          </div>
        ) : projects.length > 0 ? (
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-medium text-white mb-4">我的项目</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(project => (
                <Card key={project.id} className="group relative hover:border-slate-500 transition-colors">
                  <Link href={`/workspace/${project.id}`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base truncate">{project.name}</CardTitle>
                      {project.description && (
                        <CardDescription className="text-sm line-clamp-2">
                          {project.description}
                        </CardDescription>
                      )}
                      <p className="text-xs text-slate-500 mt-2">{formatTime(project.updatedAt)}</p>
                    </CardHeader>
                  </Link>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <a
                      href={project.gitlabUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="p-1 rounded hover:bg-slate-700"
                    >
                      <ExternalLink className="h-4 w-4 text-slate-400" />
                    </a>
                    <button
                      onClick={(e) => { e.preventDefault(); handleDelete(project.id); }}
                      disabled={deleting === project.id}
                      className="p-1 rounded hover:bg-red-900/50"
                    >
                      {deleting === project.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-400" />
                      )}
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-slate-500">还没有项目，从上方开始创建或导入</p>
        )}
      </main>
    </div>
  );
}
