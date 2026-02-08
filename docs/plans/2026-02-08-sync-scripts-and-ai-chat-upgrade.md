# Sync Scripts & AI Chat Upgrade Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the automation layer that populates component docs from GitLab source repos, then upgrade the AI chat API to use the knowledge base for accurate component recommendations.

**Architecture:** Three standalone sync scripts pull component docs from GitLab into `knowledge-base/{library}/` as .md files. A new knowledge-base query module provides keyword matching + doc lookup. The chat API is upgraded to inject relevant component context into Claude's system prompt dynamically.

**Tech Stack:** TypeScript, Node.js (ts-node), GitLab REST API (via fetch), existing Prisma schema, Anthropic Claude SDK with tool_use.

---

## Phase 1: Sync Scripts (Tasks 1-4)

### Task 1: Shared GitLab Fetch Utility

Create a shared utility for all sync scripts to fetch files from GitLab.

**Files:**
- Create: `knowledge-base/scripts/gitlab-api.ts`

**Step 1: Create the GitLab API utility**

This module wraps GitLab REST API for fetching file contents and directory trees. Uses `GITLAB_URL` and `GITLAB_TOKEN` env vars (admin-level, not per-user).

```typescript
// knowledge-base/scripts/gitlab-api.ts
const GITLAB_URL = process.env.GITLAB_URL || 'https://git.ucloudadmin.com';
const GITLAB_TOKEN = process.env.GITLAB_TOKEN;

if (!GITLAB_TOKEN) {
  console.error('Error: GITLAB_TOKEN env var is required');
  process.exit(1);
}

const headers = { 'PRIVATE-TOKEN': GITLAB_TOKEN };

export async function getTree(projectPath: string, dirPath: string, ref = 'main'): Promise<Array<{ name: string; type: string; path: string }>> {
  const encoded = encodeURIComponent(projectPath);
  const url = `${GITLAB_URL}/api/v4/projects/${encoded}/repository/tree?path=${encodeURIComponent(dirPath)}&ref=${ref}&per_page=100`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GitLab tree error: ${res.status} for ${projectPath}/${dirPath}`);
  return res.json();
}

export async function getFileContent(projectPath: string, filePath: string, ref = 'main'): Promise<string | null> {
  const encoded = encodeURIComponent(projectPath);
  const fileEncoded = encodeURIComponent(filePath);
  const url = `${GITLAB_URL}/api/v4/projects/${encoded}/repository/files/${fileEncoded}?ref=${ref}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`GitLab file error: ${res.status} for ${projectPath}/${filePath}`);
  }
  const data = await res.json();
  return Buffer.from(data.content, 'base64').toString('utf8');
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit knowledge-base/scripts/gitlab-api.ts` (or just verify no syntax errors)

**Step 3: Commit**

```bash
git add knowledge-base/scripts/gitlab-api.ts
git commit -m "feat: add shared GitLab API utility for sync scripts"
```

---

### Task 2: Pro-Components Sync Script

Sync docs from `console-ops/pro-components` GitLab repo into `knowledge-base/udesign-pro/`.

**Source structure** (confirmed from repo):
```
packages/{name}/src/
├── typings.ts       # Props interfaces with JSDoc (e.g. packages/copy/src/typings.ts)
├── {name}.md        # Dumi doc with usage examples (e.g. packages/copy/src/copy.md)
├── types.ts         # Some packages use types.ts instead of typings.ts (e.g. table)
├── demos/           # Optional demo files
│   └── *.tsx
└── index.tsx        # Entry file
```

**35 packages:** alert-error, batch-modal, card, card-list, code, components, config-info, copy, date-time, drawer, drawer-form, drop-down, empty-state, error-boundary, export-btn, form, hovertip, login, modal-form, name-remark, password, product-layout, progress, provider, resource-select, resources, result, state, statistic, table, tabs, tag, text-ellipsis, tree-select, typography

**Files:**
- Create: `knowledge-base/scripts/sync-pro.ts`
- Output: `knowledge-base/udesign-pro/{name}.md` (one per package)

**Step 1: Write the sync script**

```typescript
// knowledge-base/scripts/sync-pro.ts
import { getTree, getFileContent } from './gitlab-api';
import * as fs from 'fs';
import * as path from 'path';

const PROJECT = 'console-ops/pro-components';
const REF = 'main';
const OUTPUT_DIR = path.join(__dirname, '..', 'udesign-pro');

// Skip 'components' and 'provider' — they are internal/wrapper packages
const SKIP_PACKAGES = ['components', 'provider'];

interface ParsedProps {
  name: string;
  type: string;
  required: boolean;
  description: string;
  default?: string;
}

function parseTypingsToProps(content: string): ParsedProps[] {
  const props: ParsedProps[] = [];
  // Match JSDoc + property lines in interfaces
  // Pattern: /** description */ propName?: TypeName;
  const lines = content.split('\n');
  let currentJsDoc = '';

  for (const line of lines) {
    const trimmed = line.trim();
    // Collect JSDoc
    if (trimmed.startsWith('/**')) {
      currentJsDoc = trimmed.replace(/\/\*\*\s*/, '').replace(/\s*\*\//, '').trim();
      continue;
    }
    if (trimmed.startsWith('*') && !trimmed.startsWith('*/')) {
      currentJsDoc += ' ' + trimmed.replace(/^\*\s*/, '').trim();
      continue;
    }
    if (trimmed.startsWith('*/')) {
      currentJsDoc = currentJsDoc.trim();
      continue;
    }
    // Match property: propName?: Type;
    const propMatch = trimmed.match(/^(\w+)(\??):\s*(.+?);?\s*$/);
    if (propMatch) {
      props.push({
        name: propMatch[1],
        required: propMatch[2] !== '?',
        type: propMatch[3].replace(/;$/, '').trim(),
        description: currentJsDoc || '-',
      });
      currentJsDoc = '';
    } else {
      // If line doesn't match property pattern, keep jsDoc for next line
      if (!trimmed.startsWith('export') && !trimmed.startsWith('interface') && !trimmed.startsWith('{') && !trimmed.startsWith('}') && !trimmed.startsWith('//') && trimmed !== '') {
        currentJsDoc = '';
      }
    }
  }
  return props;
}

function propsToMarkdownTable(props: ParsedProps[]): string {
  if (props.length === 0) return '*Props 信息待补充*\n';
  let table = '| 属性 | 类型 | 必填 | 说明 |\n';
  table += '|------|------|------|------|\n';
  for (const p of props) {
    table += `| ${p.name} | \`${p.type}\` | ${p.required ? '✅' : '❌'} | ${p.description} |\n`;
  }
  return table;
}

function kebabToPascal(kebab: string): string {
  return kebab.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

async function syncPackage(pkgName: string): Promise<void> {
  const componentName = kebabToPascal(pkgName);
  const srcPath = `packages/${pkgName}/src`;

  // 1. Try to get typings.ts or types.ts for Props
  let propsContent = await getFileContent(PROJECT, `${srcPath}/typings.ts`, REF);
  if (!propsContent) {
    propsContent = await getFileContent(PROJECT, `${srcPath}/types.ts`, REF);
  }

  // 2. Get doc .md file (naming: {kebab-name}.md)
  const docContent = await getFileContent(PROJECT, `${srcPath}/${pkgName}.md`, REF);

  // 3. Parse props
  const props = propsContent ? parseTypingsToProps(propsContent) : [];

  // 4. Extract examples from doc
  let examples = '';
  if (docContent) {
    // Extract code blocks from the dumi markdown
    const codeBlocks = docContent.match(/```[jt]sx[\s\S]*?```/g);
    if (codeBlocks && codeBlocks.length > 0) {
      examples = codeBlocks.slice(0, 3).join('\n\n');
    }
  }

  // 5. Generate standardized doc
  const subPkg = `@ucloud/pro-${pkgName}`;
  let md = `# ${componentName}\n\n`;
  md += `> UDesign Pro 组件\n\n`;
  md += `## 引入\n\n`;
  md += `\`\`\`tsx\n`;
  md += `// 从主包引入\n`;
  md += `import { ${componentName} } from '@ucloud/pro-components';\n`;
  md += `// 或从子包引入（推荐，减少打包体积）\n`;
  md += `import { ${componentName} } from '${subPkg}';\n`;
  md += `\`\`\`\n\n`;
  md += `## Props\n\n`;
  md += propsToMarkdownTable(props);
  md += `\n`;

  if (examples) {
    md += `## 用法示例\n\n`;
    md += examples;
    md += `\n\n`;
  }

  if (docContent && docContent.includes('<API')) {
    md += `## 完整 API 文档\n\n`;
    md += `详见 [在线文档](http://console-ops.page.ucloudadmin.com/pro-components/components/${pkgName})\n\n`;
  }

  md += `## 注意事项\n\n`;
  md += `- 安装需使用内部 npm registry: \`--registry=http://registry.npm.pre.ucloudadmin.com\`\n`;
  md += `- 可在任意 React 项目中使用（不依赖控制台环境）\n\n`;
  md += `---\n*source: auto-sync from console-ops/pro-components*\n`;

  // Write file
  const outputPath = path.join(OUTPUT_DIR, `${componentName}.md`);
  fs.writeFileSync(outputPath, md, 'utf8');
  console.log(`✅ ${componentName} → ${outputPath}`);
}

async function main() {
  // Ensure output dir exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Get all packages
  const tree = await getTree(PROJECT, 'packages', REF);
  const packages = tree
    .filter(item => item.type === 'tree' && !SKIP_PACKAGES.includes(item.name))
    .map(item => item.name);

  console.log(`Found ${packages.length} packages to sync...`);

  let success = 0;
  let failed = 0;

  for (const pkg of packages) {
    try {
      await syncPackage(pkg);
      success++;
    } catch (err) {
      console.error(`❌ ${pkg}: ${err}`);
      failed++;
    }
  }

  console.log(`\nDone: ${success} synced, ${failed} failed out of ${packages.length} total`);
}

main().catch(console.error);
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit --esModuleInterop --module esnext --moduleResolution node knowledge-base/scripts/sync-pro.ts`

**Step 3: Commit**

```bash
git add knowledge-base/scripts/sync-pro.ts
git commit -m "feat: add pro-components sync script"
```

---

### Task 3: Common-Components Sync Script

Sync docs from `console/common-components` GitLab repo into `knowledge-base/common-components/`.

**Source structure** (confirmed from repo):
```
src/{ComponentName}/
├── README.md              # Component overview
├── {ComponentName}.md     # Usage examples with live=true code blocks
├── {ComponentName}.jsx    # Source code (JSX, not TypeScript — no typings.ts)
├── index.jsx              # Entry
└── style/                 # Optional styles
```

**26 component directories** (excluding common/, components/, hooks/, label/ which are utilities):
BatchModal, Copy, DocLink, Drawer, ErrorBoundary, ExportCSV, IAMError, IntlServiceContext, Locale, LoginConfig, Modal, ModifyNameRemark, ModifyPassword, NPS, Notice, Password, ProductNotice, ProductPrice, ProductRoutes, ProjectSelect, RegionZone, ResourceId, ResourceLabel, RouterTabs, Tag, VerifyCodeForm

**Files:**
- Create: `knowledge-base/scripts/sync-common.ts`
- Output: `knowledge-base/common-components/{ComponentName}.md` (one per component)

**Step 1: Write the sync script**

```typescript
// knowledge-base/scripts/sync-common.ts
import { getTree, getFileContent } from './gitlab-api';
import * as fs from 'fs';
import * as path from 'path';

const PROJECT = 'console/common-components';
const REF = 'master'; // common-components uses master branch
const OUTPUT_DIR = path.join(__dirname, '..', 'common-components');

// Skip utility directories
const SKIP_DIRS = ['common', 'components', 'hooks', 'label'];

function extractPropsFromJSX(content: string): string {
  // Extract propTypes block for JSX components
  const propTypesMatch = content.match(/(\w+)\.propTypes\s*=\s*\{([\s\S]*?)\};/);
  if (!propTypesMatch) return '*Props 信息需要从源码 propTypes 提取，建议手动补充*\n';

  const block = propTypesMatch[2];
  const lines = block.split('\n');
  let table = '| 属性 | 类型 | 说明 |\n';
  table += '|------|------|------|\n';

  for (const line of lines) {
    const trimmed = line.trim();
    // Match: propName: PropTypes.string,  or  propName: PropTypes.string.isRequired,
    const match = trimmed.match(/^(\w+)\s*:\s*PropTypes\.(\w+)/);
    if (match) {
      const required = trimmed.includes('isRequired') ? ' (必填)' : '';
      table += `| ${match[1]} | ${match[2]}${required} | - |\n`;
    }
  }
  return table;
}

function extractExamplesFromMd(content: string): string {
  // common-components uses ```jsx live=true blocks
  const blocks = content.match(/```jsx[^\n]*\n[\s\S]*?```/g);
  if (!blocks || blocks.length === 0) return '';

  // Take up to 3 examples, convert live=true format to standard
  return blocks.slice(0, 3).map(block => {
    return block.replace(/```jsx\s*live=true/, '```jsx');
  }).join('\n\n');
}

async function syncComponent(componentName: string): Promise<void> {
  const srcPath = `src/${componentName}`;

  // 1. Get README.md for overview
  const readme = await getFileContent(PROJECT, `${srcPath}/README.md`, REF);

  // 2. Get {Component}.md for examples
  const docMd = await getFileContent(PROJECT, `${srcPath}/${componentName}.md`, REF);

  // 3. Get main source file for propTypes
  const mainJsx = await getFileContent(PROJECT, `${srcPath}/${componentName}.jsx`, REF);
  // Some use .tsx
  const mainTsx = mainJsx ? null : await getFileContent(PROJECT, `${srcPath}/${componentName}.tsx`, REF);
  const sourceContent = mainJsx || mainTsx;

  // Build doc
  let md = `# ${componentName}\n\n`;
  md += `> Console 业务组件 — **仅可在控制台项目中使用**\n\n`;

  // Description from README
  if (readme) {
    // Extract first meaningful paragraph from README
    const paragraphs = readme.split('\n\n').filter(p => p.trim() && !p.trim().startsWith('#'));
    if (paragraphs.length > 0) {
      md += paragraphs[0].trim() + '\n\n';
    }
  }

  md += `## 引入\n\n`;
  md += `\`\`\`jsx\nimport { ${componentName} } from 'common-components';\n\`\`\`\n\n`;

  // Props
  md += `## Props\n\n`;
  if (sourceContent) {
    md += extractPropsFromJSX(sourceContent);
  } else {
    md += '*Props 信息待补充*\n';
  }
  md += '\n';

  // Examples
  if (docMd) {
    const examples = extractExamplesFromMd(docMd);
    if (examples) {
      md += `## 用法示例\n\n`;
      md += `> 注意：示例中的 \`CommonComponents\` 是文档环境变量，实际使用时直接 import\n\n`;
      md += examples;
      md += '\n\n';
    }
  }

  md += `## 注意事项\n\n`;
  md += `- ⚠️ **仅限控制台项目** — 依赖控制台框架的 services、登录态、地域等能力\n`;
  md += `- 在 \`.console/dependences.js\` 中添加 \`'common-components'\` 进行引入\n`;
  md += `- 不可在独立 React 项目或 Sandpack 预览中使用\n\n`;

  md += `---\n*source: auto-sync from console/common-components*\n`;

  const outputPath = path.join(OUTPUT_DIR, `${componentName}.md`);
  fs.writeFileSync(outputPath, md, 'utf8');
  console.log(`✅ ${componentName} → ${outputPath}`);
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const tree = await getTree(PROJECT, 'src', REF);
  const components = tree
    .filter(item => item.type === 'tree' && !SKIP_DIRS.includes(item.name))
    .map(item => item.name);

  console.log(`Found ${components.length} components to sync...`);

  let success = 0;
  let failed = 0;

  for (const comp of components) {
    try {
      await syncComponent(comp);
      success++;
    } catch (err) {
      console.error(`❌ ${comp}: ${err}`);
      failed++;
    }
  }

  console.log(`\nDone: ${success} synced, ${failed} failed out of ${components.length} total`);
}

main().catch(console.error);
```

**Step 2: Verify it compiles**

**Step 3: Commit**

```bash
git add knowledge-base/scripts/sync-common.ts
git commit -m "feat: add common-components sync script"
```

---

### Task 4: UDesign Sync Script (Stub)

UDesign is on public GitHub (`UCloud-FE/u-design`). The doc site at `https://udesign.ucloud.cn` has all info. For now, create a stub that generates skeleton docs from registry.json entries, to be enriched later by scraping the doc site or GitHub.

**Files:**
- Create: `knowledge-base/scripts/sync-udesign.ts`
- Output: `knowledge-base/udesign/{ComponentName}.md`

**Step 1: Write the stub sync script**

```typescript
// knowledge-base/scripts/sync-udesign.ts
import * as fs from 'fs';
import * as path from 'path';

const REGISTRY_PATH = path.join(__dirname, '..', 'registry.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'udesign');

interface RegistryEntry {
  name: string;
  library: string;
  category: string;
  import: string;
  description: string;
  keywords: string[];
  docFile: string;
  hasConflict: boolean;
  conflictWith?: string[];
  notes?: string;
}

interface Registry {
  components: RegistryEntry[];
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const registry: Registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  const udesignComponents = registry.components.filter(c => c.library === 'udesign');

  console.log(`Generating docs for ${udesignComponents.length} UDesign components...`);

  for (const comp of udesignComponents) {
    let md = `# ${comp.name}\n\n`;
    md += `> ${comp.description}\n\n`;
    md += `## 引入\n\n`;
    md += `\`\`\`tsx\n${comp.import}\n\`\`\`\n\n`;
    md += `## Props\n\n`;
    md += `*待从 UDesign 文档站同步，参见 [在线文档](https://udesign.ucloud.cn)*\n\n`;
    md += `## 基本用法\n\n`;
    md += `\`\`\`tsx\n// 待补充\n\`\`\`\n\n`;

    if (comp.hasConflict) {
      md += `## ⚠️ 命名冲突\n\n`;
      md += `此组件与 ${(comp.conflictWith || []).join(', ')} 存在命名冲突。`;
      md += `请查阅 conflict-rules.json 了解使用规则。\n\n`;
    }

    if (comp.notes) {
      md += `## 注意事项\n\n- ${comp.notes}\n\n`;
    }

    md += `---\n*source: auto-sync from registry.json (skeleton — needs manual enrichment)*\n`;

    const outputPath = path.join(OUTPUT_DIR, `${comp.name}.md`);
    fs.writeFileSync(outputPath, md, 'utf8');
    console.log(`✅ ${comp.name}`);
  }

  console.log('\nDone. Note: These are skeleton docs. Enrich with UDesign doc site content.');
}

main().catch(console.error);
```

**Step 2: Commit**

```bash
git add knowledge-base/scripts/sync-udesign.ts
git commit -m "feat: add UDesign sync stub (generates skeletons from registry)"
```

---

## Phase 2: Knowledge-Base Query Module (Task 5)

### Task 5: Component Lookup Service

Build the server-side module that the chat API will use to find relevant components and load their docs.

**Files:**
- Create: `src/lib/knowledge-base.ts`

**Step 1: Write the knowledge-base query module**

This module reads `registry.json` and provides:
- `searchComponents(query: string, projectType: 'console' | 'standalone')` → ranked component list
- `getComponentDoc(docFile: string)` → full markdown content
- `getConflictRule(componentName: string)` → disambiguation rule
- `getPageTemplate(pageType: string)` → template definition

```typescript
// src/lib/knowledge-base.ts
import * as fs from 'fs';
import * as path from 'path';

const KB_DIR = path.join(process.cwd(), 'knowledge-base');

// Types
interface RegistryComponent {
  name: string;
  library: 'udesign' | 'udesign-pro' | 'common-components';
  category: string;
  import: string;
  description: string;
  keywords: string[];
  hasConflict: boolean;
  conflictWith?: string[];
  docFile: string;
  subComponents?: string[];
  subPackage?: string;
  notes?: string;
}

interface ConflictRule {
  componentName: string;
  involvedLibraries: string[];
  console: { use: string; import: string; reason: string } | { useMap: Record<string, { use: string; import: string; reason: string }> };
  standalone: { use: string; import: string; reason: string };
  note?: string;
}

interface PageTemplate {
  id: string;
  name: string;
  description: string;
  applicableTo: string[];
  components: {
    console: { required: string[]; optional: string[] };
    standalone: { required: string[]; optional: string[] };
  };
  skeleton: Record<string, string>;
  exampleProjects?: string[];
}

interface Registry {
  libraries: Record<string, unknown>;
  categories: Record<string, string>;
  components: RegistryComponent[];
}

// Cache loaded data
let _registry: Registry | null = null;
let _conflictRules: ConflictRule[] | null = null;
let _pageTemplates: PageTemplate[] | null = null;

function loadRegistry(): Registry {
  if (!_registry) {
    _registry = JSON.parse(fs.readFileSync(path.join(KB_DIR, 'registry.json'), 'utf8'));
  }
  return _registry!;
}

function loadConflictRules(): ConflictRule[] {
  if (!_conflictRules) {
    const data = JSON.parse(fs.readFileSync(path.join(KB_DIR, 'conflict-rules.json'), 'utf8'));
    _conflictRules = data.rules || data;
  }
  return _conflictRules!;
}

function loadPageTemplates(): PageTemplate[] {
  if (!_pageTemplates) {
    const data = JSON.parse(fs.readFileSync(path.join(KB_DIR, 'page-templates.json'), 'utf8'));
    _pageTemplates = data.templates || data;
  }
  return _pageTemplates!;
}

// Keyword matching with Chinese support
function matchScore(query: string, component: RegistryComponent): number {
  const q = query.toLowerCase();
  const tokens = q.split(/[\s,，、]+/).filter(Boolean);
  let score = 0;

  for (const token of tokens) {
    // Name match (highest)
    if (component.name.toLowerCase().includes(token)) score += 10;
    // Keyword match
    for (const kw of component.keywords) {
      if (kw.toLowerCase().includes(token) || token.includes(kw.toLowerCase())) score += 5;
    }
    // Description match
    if (component.description.toLowerCase().includes(token)) score += 3;
    // Category match
    if (component.category.toLowerCase().includes(token)) score += 2;
  }

  return score;
}

export function searchComponents(
  query: string,
  projectType: 'console' | 'standalone' = 'standalone',
  limit = 8
): RegistryComponent[] {
  const registry = loadRegistry();
  let components = registry.components;

  // Filter by environment if standalone
  if (projectType === 'standalone') {
    components = components.filter(c => c.library !== 'common-components');
  }

  // Score and rank
  const scored = components
    .map(c => ({ component: c, score: matchScore(query, c) }))
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(s => s.component);
}

export function getComponentDoc(docFile: string): string | null {
  const fullPath = path.join(KB_DIR, docFile);
  try {
    return fs.readFileSync(fullPath, 'utf8');
  } catch {
    return null;
  }
}

export function getConflictRule(componentName: string): ConflictRule | null {
  const rules = loadConflictRules();
  return rules.find(r => r.componentName === componentName) || null;
}

export function getPageTemplate(pageType: string): PageTemplate | null {
  const templates = loadPageTemplates();
  return templates.find(t => t.id === pageType || t.name.includes(pageType)) || null;
}

export function buildComponentContext(
  components: RegistryComponent[],
  projectType: 'console' | 'standalone'
): string {
  let context = '## 推荐组件\n\n';

  for (const comp of components) {
    context += `### ${comp.name} (${comp.library})\n`;
    context += `${comp.description}\n`;
    context += `\`\`\`tsx\n${comp.import}\n\`\`\`\n`;

    if (comp.hasConflict) {
      const rule = getConflictRule(comp.name);
      if (rule) {
        const resolution = projectType === 'console' ? rule.console : rule.standalone;
        if ('use' in resolution) {
          context += `⚠️ 冲突提示：在${projectType === 'console' ? '控制台' : '独立'}项目中应使用 ${resolution.use}。${resolution.reason}\n`;
        }
      }
    }

    // Try to load doc summary (first 500 chars)
    const doc = getComponentDoc(comp.docFile);
    if (doc) {
      const summary = doc.slice(0, 500);
      context += `\n${summary}...\n`;
    }

    context += '\n';
  }

  return context;
}

// Clear cache (for hot-reload in dev)
export function clearCache(): void {
  _registry = null;
  _conflictRules = null;
  _pageTemplates = null;
}
```

**Step 2: Add ts-node as dev dependency for running sync scripts**

Run: `npm install --save-dev ts-node`

**Step 3: Verify diagnostics**

Run: `npx tsc --noEmit src/lib/knowledge-base.ts`

**Step 4: Commit**

```bash
git add src/lib/knowledge-base.ts
git commit -m "feat: add knowledge-base query module for component lookup"
```

---

## Phase 3: AI Chat Upgrade (Tasks 6-7)

### Task 6: Upgrade Chat API — Dynamic Context Injection

Replace the hardcoded system prompt in `src/app/api/projects/[id]/chat/route.ts` with dynamic component context based on user's message.

**Files:**
- Modify: `src/app/api/projects/[id]/chat/route.ts`

**Step 1: Refactor the POST handler**

Key changes:
1. Detect project type (console vs standalone) from project config
2. Search knowledge base for relevant components based on user message
3. Build dynamic system prompt with component context
4. Add `tool_use` support for `lookup_component` tool

The system prompt structure follows `knowledge-base/system-prompt-template.md`:
- Static rules section (role, output format, coding conventions)
- Dynamic section (project info, matched components, conflict rules)

```typescript
// Updated POST handler — see the actual implementation
// Key parts to change:

// 1. Import knowledge-base module
import { searchComponents, getComponentDoc, buildComponentContext, getConflictRule } from '@/lib/knowledge-base';

// 2. Detect project type
// For now, check if project has .console/ directory
const isConsole = files.some(f => f.startsWith('.console/') || f.includes('dependences.js'));
const projectType = isConsole ? 'console' : 'standalone';

// 3. Build dynamic system prompt
const relevantComponents = searchComponents(message, projectType, 8);
const componentContext = buildComponentContext(relevantComponents, projectType);
const systemPrompt = `你是 Page Factory AI 助手，帮助开发项目"${project.name}"（${projectType === 'console' ? '控制台' : '独立'}项目）。

## 项目文件
${files.slice(0, 30).join(', ')}

## 可用组件
${componentContext}

## 规则
1. 始终使用上面列出的组件和 import 语句
2. 如果组件有冲突标记，严格按冲突规则使用
3. common-components 组件仅限控制台项目使用
4. 用中文回复

## 工具
- 用 <read_file path="路径"/> 读取项目文件
- 用 <write_file path="路径">内容</write_file> 写入文件
- 如果需要查看某个组件的完整文档，请告诉用户你需要查看哪个组件的详细信息`;
```

**Step 2: Update the full route.ts with the new system prompt logic**

This is the main change — replace the single-line systemPrompt with the dynamic version. Keep everything else (GET, DELETE, read/write file handling) the same.

**Step 3: Verify diagnostics**

**Step 4: Commit**

```bash
git add src/app/api/projects/[id]/chat/route.ts src/lib/knowledge-base.ts
git commit -m "feat: upgrade chat API with dynamic component context injection"
```

---

### Task 7: Add Claude tool_use — lookup_component Tool

Enhance the Claude call with `tools` parameter so Claude can look up detailed component docs mid-conversation.

**Files:**
- Modify: `src/app/api/projects/[id]/chat/route.ts`

**Step 1: Define the tool**

```typescript
const tools = [
  {
    name: 'lookup_component',
    description: '查看某个组件的完整文档，包括 Props 定义、用法示例和注意事项。当需要准确使用某个组件时调用此工具。',
    input_schema: {
      type: 'object',
      properties: {
        component_name: {
          type: 'string',
          description: '组件名称，如 ProTable, RegionZone, Button'
        },
        library: {
          type: 'string',
          enum: ['udesign', 'udesign-pro', 'common-components'],
          description: '组件所属库'
        }
      },
      required: ['component_name']
    }
  }
];
```

**Step 2: Handle tool_use in the response loop**

After Claude responds, check if the response contains a `tool_use` block. If so, look up the component doc, send the result back as `tool_result`, and get the final response.

```typescript
// Simplified tool handling loop
let response = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 4096,
  system: systemPrompt,
  messages: historyMessages,
  tools: tools
});

// Handle tool use (max 3 iterations to prevent infinite loops)
let iterations = 0;
while (response.stop_reason === 'tool_use' && iterations < 3) {
  const toolUse = response.content.find(c => c.type === 'tool_use');
  if (!toolUse || toolUse.type !== 'tool_use') break;

  let toolResult = '';
  if (toolUse.name === 'lookup_component') {
    const input = toolUse.input as { component_name: string; library?: string };
    // Search registry for exact match
    const registry = loadRegistry(); // from knowledge-base module
    const comp = registry.components.find(c =>
      c.name === input.component_name &&
      (!input.library || c.library === input.library)
    );
    if (comp) {
      const doc = getComponentDoc(comp.docFile);
      toolResult = doc || `组件 ${input.component_name} 的详细文档暂未生成。基本信息：\n${comp.import}\n${comp.description}`;
    } else {
      toolResult = `未找到组件 "${input.component_name}"。请检查组件名是否正确。`;
    }
  }

  // Send tool result back
  historyMessages.push({ role: 'assistant', content: response.content });
  historyMessages.push({
    role: 'user',
    content: [{ type: 'tool_result', tool_use_id: toolUse.id, content: toolResult }]
  });

  response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    messages: historyMessages,
    tools: tools
  });
  iterations++;
}
```

**Step 3: Extract final text from response (may have mixed content blocks)**

**Step 4: Commit**

```bash
git add src/app/api/projects/[id]/chat/route.ts
git commit -m "feat: add lookup_component tool for Claude to query component docs"
```

---

## Phase 4: Run & Verify (Task 8)

### Task 8: Execute Sync Scripts & Verify End-to-End

**Step 1: Run pro-components sync**

```bash
GITLAB_TOKEN=<token> npx ts-node knowledge-base/scripts/sync-pro.ts
```

Expected: ~33 `.md` files created in `knowledge-base/udesign-pro/`

**Step 2: Run common-components sync**

```bash
GITLAB_TOKEN=<token> npx ts-node knowledge-base/scripts/sync-common.ts
```

Expected: ~26 `.md` files created in `knowledge-base/common-components/`

**Step 3: Run UDesign stub sync**

```bash
npx ts-node knowledge-base/scripts/sync-udesign.ts
```

Expected: ~45 skeleton `.md` files in `knowledge-base/udesign/`

**Step 4: Verify knowledge-base query module**

Write a quick test:
```bash
npx ts-node -e "
const kb = require('./src/lib/knowledge-base');
console.log('Search: 表格', kb.searchComponents('表格').map(c => c.name));
console.log('Search: region', kb.searchComponents('region', 'console').map(c => c.name));
console.log('Conflict: Modal', kb.getConflictRule('Modal'));
"
```

**Step 5: Start dev server and test chat**

```bash
npm run dev
```

Open browser, navigate to a project, send: "我需要做一个资源列表页面，包含搜索、表格和批量操作"

Expected: AI response should mention ProTable, BatchModal, etc. with correct imports.

**Step 6: Commit all generated docs**

```bash
git add knowledge-base/udesign-pro/ knowledge-base/common-components/ knowledge-base/udesign/
git commit -m "docs: add auto-synced component documentation for all 3 libraries"
```

---

## Summary

| Task | Deliverable | Files |
|------|-------------|-------|
| 1 | GitLab API utility | `knowledge-base/scripts/gitlab-api.ts` |
| 2 | Pro sync script | `knowledge-base/scripts/sync-pro.ts` |
| 3 | Common sync script | `knowledge-base/scripts/sync-common.ts` |
| 4 | UDesign sync stub | `knowledge-base/scripts/sync-udesign.ts` |
| 5 | KB query module | `src/lib/knowledge-base.ts` |
| 6 | Chat API upgrade | `src/app/api/projects/[id]/chat/route.ts` (modify) |
| 7 | lookup_component tool | `src/app/api/projects/[id]/chat/route.ts` (modify) |
| 8 | Run & verify | Execute scripts, test chat |

**Dependencies:** Task 1 → Tasks 2, 3 (parallel). Task 4 is independent. Task 5 is independent. Tasks 6 → 7 (sequential). Task 8 depends on all.

**Parallelizable groups:**
- Group A: Tasks 2, 3, 4 (all sync scripts, after Task 1)
- Group B: Task 5 (knowledge-base module, independent)
- Group C: Tasks 6 → 7 (chat upgrade, after Task 5)
- Group D: Task 8 (verification, after all)
