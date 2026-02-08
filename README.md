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

# 或者使用完整的 docker-compose.yml
docker compose up -d postgres
```

如果没有 Docker，可以使用本地 PostgreSQL 或其他方式：
- 确保 PostgreSQL 运行在 localhost:5432
- 创建数据库：`page_factory`
- 用户：`postgres`，密码：`postgres`

### 3. 配置环境变量

复制 `.env.example` 到 `.env` 并修改：

```bash
cp .env.example .env
```

主要配置项：
- `DATABASE_URL`: PostgreSQL 连接字符串
- `JWT_SECRET`: JWT 密钥（生产环境请修改）
- `ANTHROPIC_API_KEY`: Claude API Key（可选，也可在设置页面配置）
- `PROJECTS_DIR`: 项目克隆目录

### 4. 初始化数据库

```bash
npx prisma migrate dev
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 使用说明

### 首次使用

1. 访问 http://localhost:3000/register 注册账号
2. 登录后进入设置页面，配置 GitLab 地址和 Token
3. （可选）配置 Claude API Key，或使用环境变量中的默认值

### 导入项目

1. 点击"已有项目"卡片
2. 搜索 GitLab 项目
3. 点击"导入"按钮克隆项目到本地

### 项目工作台

1. 选择分支（main/master 为受保护分支，不能直接提交）
2. 使用 AI 助手修改代码
3. 在预览区域查看效果
4. 提交更改到 GitLab

## Docker 部署

### 完整部署（应用 + 数据库）

```bash
# 构建并启动
docker compose up -d

# 查看日志
docker compose logs -f app
```

### 生产环境配置

修改 `docker-compose.yml` 中的环境变量：

```yaml
environment:
  JWT_SECRET: your-production-secret-key
  ANTHROPIC_API_KEY: your-api-key
```

## 项目结构

```
page-factory/
├── prisma/
│   └── schema.prisma      # 数据库模型
├── src/
│   ├── app/
│   │   ├── api/           # API 路由
│   │   ├── login/         # 登录页
│   │   ├── register/      # 注册页
│   │   ├── settings/      # 设置页
│   │   ├── projects/      # 项目列表页
│   │   └── workspace/     # 项目工作台
│   ├── components/ui/     # UI 组件
│   └── lib/               # 工具函数
├── docker-compose.yml     # 生产环境配置
├── docker-compose.dev.yml # 开发环境配置
└── Dockerfile             # 容器构建配置
```

## 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: TailwindCSS + Shadcn/UI
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: JWT (jose)
- **AI**: Claude API (Anthropic)
- **Git**: simple-git

## License

MIT
