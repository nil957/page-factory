'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Search, Loader2, GitBranch } from 'lucide-react';
import Link from 'next/link';

interface GitLabProject {
  id: number;
  name: string;
  description: string | null;
  http_url_to_repo: string;
  last_activity_at: string;
  path_with_namespace: string;
}

export default function ImportPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [projects, setProjects] = useState<GitLabProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [cloning, setCloning] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/gitlab/search?search=${encodeURIComponent(search)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '搜索失败');
        return;
      }

      setProjects(data);
    } catch {
      setError('网络错误');
    } finally {
      setLoading(false);
    }
  };

  const handleClone = async (project: GitLabProject) => {
    setCloning(project.id);

    try {
      const res = await fetch('/api/gitlab/clone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gitlabProjectId: project.id,
          name: project.name,
          httpUrlToRepo: project.http_url_to_repo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '克隆失败');
        return;
      }

      router.push(`/workspace/${data.projectId}`);
    } catch {
      setError('网络错误');
    } finally {
      setCloning(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">导入项目</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>搜索 GitLab 项目</CardTitle>
            <CardDescription>
              输入项目名称搜索你的 GitLab 项目
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索项目..."
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id} className="hover:border-slate-600 transition-colors">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-slate-400" />
                      <h3 className="font-semibold truncate">{project.path_with_namespace}</h3>
                    </div>
                    {project.description && (
                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        {project.description}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      最后更新: {new Date(project.last_activity_at).toLocaleString('zh-CN')}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleClone(project)}
                    disabled={cloning !== null}
                    className="ml-4"
                  >
                    {cloning === project.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        克隆中...
                      </>
                    ) : (
                      '导入'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {projects.length === 0 && !loading && (
            <div className="text-center py-12 text-slate-400">
              <p>输入关键词搜索 GitLab 项目</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
