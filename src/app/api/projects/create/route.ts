import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cloneRepository } from '@/lib/git'
import { createGitLabProject, pushFileToGitLab } from '@/lib/gitlab'

const CONSOLE_SCAFFOLD: Record<string, string> = {
  '.console/project.json': JSON.stringify({
    name: '',
    version: '1.0.0',
    productKey: '',
    entry: 'src/index.tsx',
  }, null, 2),

  '.console/dependences.js': `module.exports = {
  'common-components': '^latest',
};
`,

  'package.json': JSON.stringify({
    name: '',
    version: '1.0.0',
    private: true,
    dependencies: {
      '@ucloud/pro-components': 'latest',
      '@ucloud-fe/react-components': 'latest',
      react: '^18.2.0',
      'react-dom': '^18.2.0',
    },
    devDependencies: {
      typescript: '^5.0.0',
      '@types/react': '^18.2.0',
      '@types/react-dom': '^18.2.0',
    },
  }, null, 2),

  'tsconfig.json': JSON.stringify({
    compilerOptions: {
      target: 'es2015',
      module: 'esnext',
      moduleResolution: 'node',
      jsx: 'react-jsx',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      baseUrl: '.',
      paths: { '@/*': ['src/*'] },
    },
    include: ['src'],
  }, null, 2),

  'src/index.tsx': `import React from 'react';
import { ProductRoutes } from 'common-components';
import routes from './routes';

export default function App() {
  return <ProductRoutes routes={routes} />;
}
`,

  'src/routes.tsx': `import React from 'react';

const List = React.lazy(() => import('./pages/List'));

const routes = [
  {
    path: '/',
    element: <List />,
  },
];

export default routes;
`,

  'src/pages/List.tsx': `import React from 'react';
import { ProTable } from '@ucloud/pro-components';
import { Button } from '@ucloud-fe/react-components';

export default function List() {
  return (
    <div>
      <h2>资源列表</h2>
      <ProTable
        columns={[
          { title: '名称', dataIndex: 'name' },
          { title: '状态', dataIndex: 'status' },
        ]}
        dataSource={[]}
      />
    </div>
  );
}
`,
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 })

    const { name, description, template } = await request.json()
    if (!name) return NextResponse.json({ error: '缺少项目名称' }, { status: 400 })

    const settings = await prisma.settings.findUnique({ where: { userId: session.userId } })
    if (!settings?.gitlabUrl || !settings?.gitlabAccessToken) {
      return NextResponse.json({ error: '请先配置 GitLab 设置' }, { status: 400 })
    }

    const gitlabProject = await createGitLabProject(
      settings.gitlabUrl,
      settings.gitlabAccessToken,
      name,
      description || `Page Factory 创建的${template === 'console' ? '控制台' : ''}项目`,
      'private',
      true
    )

    if (template === 'console') {
      const scaffold = { ...CONSOLE_SCAFFOLD }
      const projectJson = JSON.parse(scaffold['.console/project.json'])
      projectJson.name = name
      scaffold['.console/project.json'] = JSON.stringify(projectJson, null, 2)

      const pkgJson = JSON.parse(scaffold['package.json'])
      pkgJson.name = name
      scaffold['package.json'] = JSON.stringify(pkgJson, null, 2)

      for (const [filePath, content] of Object.entries(scaffold)) {
        await pushFileToGitLab(
          settings.gitlabUrl,
          settings.gitlabAccessToken,
          gitlabProject.id,
          filePath,
          content,
          `init: ${filePath}`,
          gitlabProject.default_branch || 'main'
        )
      }
    }

    const project = await prisma.project.create({
      data: {
        userId: session.userId,
        gitlabProjectId: gitlabProject.id,
        name: gitlabProject.name,
        description: gitlabProject.description,
        localPath: '',
        gitlabUrl: gitlabProject.web_url,
        defaultBranch: gitlabProject.default_branch,
      },
    })

    const localPath = await cloneRepository(
      gitlabProject.http_url_to_repo,
      settings.gitlabAccessToken,
      session.userId,
      project.id
    )

    const updatedProject = await prisma.project.update({
      where: { id: project.id },
      data: { localPath },
    })

    return NextResponse.json({ project: updatedProject })
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json({ error: '创建项目失败' }, { status: 500 })
  }
}
