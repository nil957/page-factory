'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();
  const [gitlabUrl, setGitlabUrl] = useState('');
  const [gitlabToken, setGitlabToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      const s = data.settings || data;
      setGitlabUrl(s.gitlabUrl || s.gitlab_url || '');
      setGitlabToken(s.gitlabAccessToken || s.gitlab_token || '');
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  }, [router]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gitlabUrl: gitlabUrl,
          gitlabAccessToken: gitlabToken,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || '保存失败');
        return;
      }

      setMessage('保存成功！');
    } catch {
      setMessage('网络错误');
    } finally {
      setLoading(false);
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
          <h1 className="text-xl font-bold text-white">设置</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>GitLab 配置</CardTitle>
            <CardDescription>
              配置你的 GitLab 服务器地址和访问令牌
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gitlabUrl">GitLab URL</Label>
                <Input
                  id="gitlabUrl"
                  value={gitlabUrl}
                  onChange={(e) => setGitlabUrl(e.target.value)}
                  placeholder="https://gitlab.example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gitlabToken">Personal Access Token</Label>
                <Input
                  id="gitlabToken"
                  type="password"
                  value={gitlabToken}
                  onChange={(e) => setGitlabToken(e.target.value)}
                  placeholder="glpat-xxxx..."
                />
                <p className="text-sm text-muted-foreground">
                  需要 api 和 read_repository 权限
                </p>
              </div>
              {message && (
                <p className={`text-sm text-center ${message.includes('成功') ? 'text-green-500' : 'text-red-500'}`}>
                  {message}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? '保存中...' : '保存设置'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
