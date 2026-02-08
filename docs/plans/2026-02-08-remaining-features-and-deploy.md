# Remaining Features + Deployment Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete all remaining Page Factory features (patterns extraction, knowledge-base admin UI, preview system, project creation flow, workspace UX improvements) and deploy to production server `ubuntu@117.50.221.245`.

**Architecture:** Feature-by-feature incremental delivery. Each feature is self-contained, testable, and committed independently. Final task handles Docker deployment to the target server.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Prisma + PostgreSQL, Tailwind CSS + Shadcn/UI, Claude API (Anthropic SDK), Docker, simple-git, ts-node.

---

## Overview

| Phase | Tasks | Description |
|-------|-------|-------------|
| Phase 1 | Tasks 1-2 | Code patterns extraction from real console projects |
| Phase 2 | Tasks 3-5 | Knowledge-base admin UI with Markdown editor |
| Phase 3 | Task 6 | Chat UX upgrade (Markdown rendering, streaming) |
| Phase 4 | Task 7 | Project creation flow (new project via GitLab) |
| Phase 5 | Task 8 | Dashboard polish (project list, quick actions) |
| Phase 6 | Task 9 | Docker deployment to 117.50.221.245 |

---

## Phase 1: Code Patterns Extraction

### Task 1: Pattern Extraction Script

Extract real-world component usage patterns from console namespace projects (uhost, udb, etc.) to give AI better examples of how components are combined in actual pages.

**Files:**
- Create: `knowledge-base/scripts/extract-patterns.ts`
- Create: `knowledge-base/patterns/` (output directory, already exists but empty)

**Step 1: Create the pattern extraction script**

```typescript
// knowledge-base/scripts/extract-patterns.ts
// 
// This script:
// 1. Lists projects under console/ namespace on GitLab
// 2. For each project, finds .tsx/.jsx page files
// 3. Extracts import statements to identify which components are used together
// 4. Generates pattern files: { project, file, imports[], componentCombination[], codeSnippet }
//
// Uses the shared gitlab-api.ts utility.
// Target repos: console/uhost, console/udb, console/ulb, console/unet, console/pathx
// (these are mature console products with good component usage patterns)

import { getTree, getFileContent } from './gitlab-api';
import * as fs from 'fs';
import * as path from 'path';

const CONSOLE_PROJECTS = [
  'console/uhost',
  'console/udb', 
  'console/ulb',
  'console/unet',
  'console/pathx',
];

// Only look at actual page/component files, not configs
const PAGE_FILE_PATTERNS = [
  /src\/.*\.(tsx|jsx)$/,
  /pages\/.*\.(tsx|jsx)$/,
];

const SKIP_PATTERNS = [
  /node_modules/,
  /\.test\./,
  /\.spec\./,
  /\.d\.ts$/,
  /__tests__/,
  /\.stories\./,
];

interface PatternEntry {
  project: string;
  filePath: string;
  imports: Array<{
    source: string;        // e.g. '@ucloud/pro-components', 'common-components'
    components: string[];  // e.g. ['ProTable', 'Copy']
  }>;
  componentCombination: string[];  // flat list of all component names used
}

function extractImports(code: string): PatternEntry['imports'] {
  const results: PatternEntry['imports'] = [];
  
  // Match: import { Foo, Bar } from 'source'
  const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = importRegex.exec(code)) !== null) {
    const components = match[1]
      .split(',')
      .map(s => s.trim().split(/\s+as\s+/)[0].trim())
      .filter(s => s.length > 0 && /^[A-Z]/.test(s)); // Only PascalCase = components
    
    const source = match[2];
    
    // Only care about our component libraries
    if (
      source.includes('pro-components') ||
      source.includes('@ucloud/pro-') ||
      source === 'common-components' ||
      source.includes('@ucloud-fe/react-components') ||
      source.includes('react-components')
    ) {
      if (components.length > 0) {
        results.push({ source, components });
      }
    }
  }
  
  return results;
}

async function extractPatternsFromProject(projectPath: string): Promise<PatternEntry[]> {
  const patterns: PatternEntry[] = [];
  
  try {
    // Get recursive file tree
    const tree = await getTree(projectPath, 'src', 'master');
    
    const pageFiles = tree.filter(item => {
      if (item.type !== 'blob') return false;
      const fullPath = item.path;
      if (SKIP_PATTERNS.some(p => p.test(fullPath))) return false;
      return PAGE_FILE_PATTERNS.some(p => p.test(fullPath));
    });
    
    console.log(`  Found ${pageFiles.length} page files in ${projectPath}`);
    
    for (const file of pageFiles.slice(0, 30)) { // Limit to 30 files per project
      try {
        const content = await getFileContent(projectPath, file.path, 'master');
        if (!content) continue;
        
        const imports = extractImports(content);
        if (imports.length === 0) continue;
        
        const allComponents = imports.flatMap(i => i.components);
        
        patterns.push({
          project: projectPath,
          filePath: file.path,
          imports,
          componentCombination: allComponents,
        });
      } catch {
        // Skip files that can't be read
      }
    }
  } catch (err) {
    console.error(`  Error processing ${projectPath}:`, err);
  }
  
  return patterns;
}

async function main() {
  const allPatterns: PatternEntry[] = [];
  
  for (const project of CONSOLE_PROJECTS) {
    console.log(`Processing ${project}...`);
    const patterns = await extractPatternsFromProject(project);
    allPatterns.push(...patterns);
    console.log(`  Extracted ${patterns.length} patterns`);
  }
  
  // Write all patterns
  const outDir = path.join(__dirname, '..', 'patterns');
  fs.mkdirSync(outDir, { recursive: true });
  
  const outFile = path.join(outDir, 'console-patterns.json');
  fs.writeFileSync(outFile, JSON.stringify(allPatterns, null, 2));
  console.log(`\nDone: ${allPatterns.length} total patterns → ${outFile}`);
  
  // Generate a summary: which component combos appear most often
  const comboCount = new Map<string, number>();
  for (const p of allPatterns) {
    const key = p.componentCombination.sort().join(' + ');
    comboCount.set(key, (comboCount.get(key) || 0) + 1);
  }
  
  const topCombos = [...comboCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30);
  
  const summaryFile = path.join(outDir, 'combo-frequency.json');
  fs.writeFileSync(summaryFile, JSON.stringify(topCombos, null, 2));
  console.log(`Top combos → ${summaryFile}`);
}

main().catch(console.error);
```

**Step 2: Run the script**

```bash
GITLAB_TOKEN=<token> npx ts-node --project knowledge-base/scripts/tsconfig.json knowledge-base/scripts/extract-patterns.ts
```

Expected: JSON files in `knowledge-base/patterns/`

**Step 3: Commit**

```bash
git add knowledge-base/scripts/extract-patterns.ts knowledge-base/patterns/
git commit -m "feat: 从控制台项目提取组件使用模式"
```

### Task 2: Integrate Patterns into Knowledge Base Query

Wire up the extracted patterns so AI can reference real-world component combinations.

**Files:**
- Modify: `src/lib/knowledge-base.ts` — add `getPatternExamples(components: string[]): PatternEntry[]`
- Modify: `src/app/api/projects/[id]/chat/route.ts` — inject pattern context into system prompt

**Step 1: Add pattern query to knowledge-base.ts**

Add function that, given a list of component names the user seems interested in, returns matching pattern entries showing how those components are used together in real console projects.

```typescript
// Add to knowledge-base.ts:
interface PatternEntry {
  project: string;
  filePath: string;
  imports: Array<{ source: string; components: string[] }>;
  componentCombination: string[];
}

let patternsCache: PatternEntry[] | null = null;

function loadPatterns(): PatternEntry[] {
  if (patternsCache) return patternsCache;
  try {
    const raw = fs.readFileSync(path.join(KB_DIR, 'patterns', 'console-patterns.json'), 'utf-8');
    patternsCache = JSON.parse(raw);
    return patternsCache!;
  } catch {
    return [];
  }
}

export function getPatternExamples(componentNames: string[], limit = 3): PatternEntry[] {
  const patterns = loadPatterns();
  const nameSet = new Set(componentNames.map(n => n.toLowerCase()));
  
  // Score patterns by how many of the requested components they use
  const scored = patterns.map(p => ({
    pattern: p,
    score: p.componentCombination.filter(c => nameSet.has(c.toLowerCase())).length
  }));
  
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.pattern);
}
```

**Step 2: Inject patterns into system prompt in route.ts**

In `buildSystemPrompt()`, after component context, add a section showing pattern examples if relevant components are found.

**Step 3: Commit**

```bash
git add src/lib/knowledge-base.ts src/app/api/projects/[id]/chat/route.ts
git commit -m "feat: AI 系统提示词注入真实项目使用模式"
```

---

## Phase 2: Knowledge-Base Admin UI

### Task 3: Admin API Routes

CRUD API for managing component docs: list, read, update doc content.

**Files:**
- Create: `src/app/api/admin/knowledge-base/route.ts` — GET (list all docs) 
- Create: `src/app/api/admin/knowledge-base/[library]/[component]/route.ts` — GET (read doc), PUT (update doc)

**Implementation:**
- GET `/api/admin/knowledge-base` returns `{ library, component, docFile, hasDoc, lineCount }[]` for all registry entries
- GET `/api/admin/knowledge-base/[library]/[component]` reads the `.md` file content
- PUT `/api/admin/knowledge-base/[library]/[component]` writes updated `.md` content
- All routes require auth (getSession check)
- Write updates to `knowledge-base/{library}/{component}.md`

**Step 1: Create list API**

**Step 2: Create read/update API**

**Step 3: Commit**

```bash
git add src/app/api/admin/
git commit -m "feat: 知识库管理 API (CRUD 组件文档)"
```

### Task 4: Admin Dashboard Page

Frontend page at `/admin/knowledge-base` with:
- Left sidebar: component list grouped by library, with search filter
- Right panel: Markdown editor (textarea) showing selected component's doc
- Save button that PUTs updated content
- Status indicators (has doc / missing doc / conflict component)

**Files:**
- Create: `src/app/admin/knowledge-base/page.tsx`

**Key UI:**
- Three collapsible sections: UDesign, UDesign-Pro, common-components
- Each component shows badge if `hasConflict`
- Click component → loads doc in editor
- Edit + Save workflow
- Use existing Shadcn components: Card, Button, Input, Badge, ScrollArea, Textarea

**Step 1: Create the admin page**

**Step 2: Verify it renders correctly with `npm run dev`**

**Step 3: Commit**

```bash
git add src/app/admin/
git commit -m "feat: 知识库管理页面 — 在线编辑组件文档"
```

### Task 5: Sync Status & Re-sync Trigger

Add ability to trigger re-sync from the admin UI.

**Files:**
- Create: `src/app/api/admin/knowledge-base/sync/route.ts` — POST triggers sync scripts
- Modify: `src/app/admin/knowledge-base/page.tsx` — add sync button

**Implementation:**
- POST `/api/admin/knowledge-base/sync` with body `{ library: 'udesign-pro' | 'common-components' | 'udesign' }`
- Runs the appropriate sync script via child_process.exec
- Returns status/output
- Requires GITLAB_TOKEN in server env

**Step 1: Create sync API**

**Step 2: Add sync button to admin page**

**Step 3: Commit**

```bash
git add src/app/api/admin/knowledge-base/sync/ src/app/admin/
git commit -m "feat: 管理页面支持触发重新同步"
```

---

## Phase 3: Chat UX Upgrade

### Task 6: Markdown Rendering + Streaming Response

Currently chat displays raw text. Upgrade to:
1. Render AI responses as Markdown (code blocks with syntax highlighting, tables, etc.)
2. Streaming responses (Server-Sent Events) so user sees tokens appear live
3. Better message UI (avatar, timestamp, copy button for code blocks)

**Files:**
- Install: `react-markdown`, `remark-gfm`, `react-syntax-highlighter` (or `shiki`)
- Create: `src/components/chat/message-content.tsx` — Markdown renderer component
- Create: `src/components/chat/chat-message.tsx` — Single message with avatar, timestamp, copy
- Modify: `src/app/workspace/[id]/page.tsx` — Use new components, implement SSE streaming
- Modify: `src/app/api/projects/[id]/chat/route.ts` — Return streaming response via ReadableStream

**Key changes:**
- Chat API returns `ReadableStream` with SSE events
- Frontend uses `EventSource` or `fetch` + `ReadableStream` reader
- Messages render Markdown with syntax highlighting
- Code blocks have copy-to-clipboard button
- File write operations show as collapsible "已修改文件" cards

**Step 1: Install markdown dependencies**

```bash
npm install react-markdown remark-gfm react-syntax-highlighter
npm install -D @types/react-syntax-highlighter
```

**Step 2: Create MessageContent component**

**Step 3: Create ChatMessage component**

**Step 4: Upgrade chat API to streaming**

Convert the POST handler to return a `ReadableStream`. Use Anthropic's streaming API (`anthropic.messages.stream()`). Each chunk writes to the stream. Tool use pauses streaming, executes tool, then resumes.

**Step 5: Upgrade workspace page to consume stream**

**Step 6: Commit**

```bash
git add src/components/chat/ src/app/workspace/ src/app/api/projects/[id]/chat/ package.json package-lock.json
git commit -m "feat: AI 对话 Markdown 渲染 + 流式响应"
```

---

## Phase 4: Project Creation Flow

### Task 7: New Project via GitLab

Replace the "敬请期待" dialog with actual project creation:
1. User fills in: project name, description, template (blank/console)
2. Platform creates GitLab repo under user's namespace
3. If console template: init with dev-cli scaffold files (.console/, package.json, etc.)
4. Clone locally + redirect to workspace

**Files:**
- Create: `src/app/api/projects/create/route.ts` — POST creates GitLab repo + local clone
- Modify: `src/app/dashboard/page.tsx` — Replace dialog with creation form
- Create: `knowledge-base/templates/console-scaffold/` — Template files for console projects

**Console scaffold template files:**
- `.console/project.json` — basic config
- `.console/dependences.js` — common-components import
- `package.json` — with @ucloud/pro-components dependency
- `src/index.tsx` — entry point
- `src/routes.tsx` — ProductRoutes + basic route config

**Step 1: Create scaffold templates**

**Step 2: Create project creation API**

**Step 3: Update dashboard with creation form**

**Step 4: Commit**

```bash
git add src/app/api/projects/create/ src/app/dashboard/ knowledge-base/templates/
git commit -m "feat: 新建项目 — GitLab 仓库创建 + 控制台项目模板"
```

---

## Phase 5: Dashboard Polish

### Task 8: Project List + Quick Actions

Current dashboard only shows "新建项目" and "已有项目" cards, no project list.

**Files:**
- Modify: `src/app/dashboard/page.tsx` — Show user's projects with last activity
- Create: `src/components/project-card.tsx` — Project card with quick actions
- Modify: `src/app/api/projects/route.ts` — GET returns user's project list

**Features:**
- Grid of project cards below the two action cards
- Each card shows: name, description, last modified, branch count
- Click → workspace
- Dropdown: delete project, open in GitLab
- Empty state: "还没有项目，从上方开始"

**Step 1: Upgrade projects list API**

**Step 2: Create ProjectCard component**

**Step 3: Update dashboard page**

**Step 4: Commit**

```bash
git add src/app/dashboard/ src/components/ src/app/api/projects/
git commit -m "feat: 仪表盘展示项目列表 + 快捷操作"
```

---

## Phase 6: Deployment

### Task 9: Deploy to 117.50.221.245

**Prerequisites:**
- SSH access: `ubuntu@117.50.221.245`
- Docker + Docker Compose installed on server
- PostgreSQL accessible (via existing `silicon-friends-app_default` network or standalone)
- `ANTHROPIC_API_KEY` env var

**Files:**
- Modify: `docker-compose.yml` — ensure production-ready config
- Modify: `Dockerfile` — ensure knowledge-base files are copied into image
- Create: `scripts/deploy.sh` — deployment script

**Step 1: Update Dockerfile to include knowledge-base**

The knowledge-base `.md` files and `.json` files need to be accessible at runtime. Currently the `standalone` output only copies `.next/` files. We need to also copy `knowledge-base/` into the production image.

Add to Dockerfile after the static copy:
```dockerfile
# Copy knowledge base files
COPY --from=builder --chown=nextjs:nodejs /app/knowledge-base ./knowledge-base
```

**Step 2: Create deploy script**

```bash
#!/bin/bash
# scripts/deploy.sh
# Deploy Page Factory to production server

set -e

SERVER="ubuntu@117.50.221.245"
REMOTE_DIR="/home/ubuntu/page-factory"

echo "🚀 Deploying Page Factory..."

# 1. Ensure remote directory exists
ssh $SERVER "mkdir -p $REMOTE_DIR"

# 2. Rsync project files (excluding node_modules, .next, .git)
rsync -avz --delete \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git \
  --exclude=projects_data \
  ./ $SERVER:$REMOTE_DIR/

# 3. Build and start on remote
ssh $SERVER "cd $REMOTE_DIR && docker compose up -d --build"

echo "✅ Deployed! Check: http://117.50.221.245:3080"
```

**Step 3: Verify Docker network + DB connectivity**

SSH into server, check if `silicon-friends-app_default` network exists and PostgreSQL is accessible at `sf-postgres:5432`.

**Step 4: Deploy**

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

**Step 5: Run Prisma migrations on server**

```bash
ssh ubuntu@117.50.221.245 "cd /home/ubuntu/page-factory && docker compose exec page-factory npx prisma migrate deploy"
```

**Step 6: Smoke test**

- Access `http://117.50.221.245:3080`
- Register account
- Configure GitLab settings
- Import a project
- Send a chat message → verify AI responds with component knowledge

**Step 7: Commit deploy scripts**

```bash
git add Dockerfile docker-compose.yml scripts/
git commit -m "chore: 部署脚本 + Dockerfile 包含知识库"
```
