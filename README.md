# Page Factory - 低代码开发平台

AI 驱动的低代码页面开发平台，支持从 GitLab 导入项目并使用 AI 助手进行开发。

## 功能特性

- 🔐 用户认证（JWT）
- 🔧 GitLab 集成（项目搜索、导入、分支管理）
- 🤖 AI 聊天助手（Claude API）
- 📝 项目文件读写
- 🚀 实时预览

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动数据库

使用 Docker Compose 启动 PostgreSQL：

```bash
# 仅启动数据库（开发环境）
docker compose -f docker-compose.dev.yml up -d
```

### 3. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件：
- `DATABASE_URL`: PostgreSQL 连接字符串
- `JWT_SECRET`: JWT 密钥（生产环境请修改）
- `ANTHROPIC_API_KEY`: Claude API Key（可选，也可在设置页面配置）

### 4. 初始化数据库

```bash
npx prisma migrate dev
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## Docker 部署

```bash
# 构建并启动
docker compose up -d

# 查看日志
docker compose logs -f app
```

## 使用说明

1. 注册/登录账号
2. 在设置页面配置 GitLab 地址和 Token
3. 点击"已有项目"搜索并导入 GitLab 项目
4. 在工作台中使用 AI 助手开发
5. 提交更改到 GitLab

## 技术栈

- Next.js 14 (App Router)
- TailwindCSS + Shadcn/UI
- PostgreSQL + Prisma ORM
- JWT (jose)
- Claude API (Anthropic)
- simple-git
