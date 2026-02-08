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
