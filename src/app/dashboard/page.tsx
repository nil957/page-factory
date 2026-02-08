'use client';

import { useRouter } from 'next/navigation';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, FolderPlus, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Page Factory</h1>
          <div className="flex items-center gap-2">
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

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:border-primary transition-colors group">
                <CardHeader className="text-center py-12">
                  <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <FolderPlus className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">新建项目</CardTitle>
                  <CardDescription className="text-base">
                    从头开始创建一个新项目
                  </CardDescription>
                </CardHeader>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>敬请期待</DialogTitle>
                <DialogDescription>
                  新建项目功能正在开发中，敬请期待！
                </DialogDescription>
              </DialogHeader>
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
      </main>
    </div>
  );
}
