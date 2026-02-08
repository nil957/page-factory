import { getTreeRecursive, getFileContent } from './gitlab-api';
import * as fs from 'fs';
import * as path from 'path';

const CONSOLE_PROJECTS = [
  'console/uhost-components',
  'console/udb-components',
  'console/unet-components',
  'console/ulb',
  'console/umem',
];

const SKIP_PATTERNS = [
  /node_modules/, /\.test\./, /\.spec\./, /\.d\.ts$/, /__tests__/, /\.stories\./,
  /\.less$/, /\.css$/, /\.json$/, /\.md$/,
];

interface PatternImport {
  source: string;
  components: string[];
}

interface PatternEntry {
  project: string;
  filePath: string;
  imports: PatternImport[];
  componentCombination: string[];
}

const COMPONENT_SOURCES = [
  'pro-components', '@ucloud/pro-', 'common-components',
  '@ucloud-fe/react-components', 'react-components',
];

function isComponentSource(source: string): boolean {
  return COMPONENT_SOURCES.some(s => source.includes(s));
}

function extractImports(code: string): PatternImport[] {
  const results: PatternImport[] = [];
  const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
  let match;

  while ((match = importRegex.exec(code)) !== null) {
    const source = match[2];
    if (!isComponentSource(source)) continue;

    const components = match[1]
      .split(',')
      .map(s => s.trim().split(/\s+as\s+/)[0].trim())
      .filter(s => s.length > 0 && /^[A-Z]/.test(s));

    if (components.length > 0) {
      results.push({ source, components });
    }
  }

  return results;
}

async function extractFromProject(projectPath: string): Promise<PatternEntry[]> {
  const patterns: PatternEntry[] = [];

  try {
    const tree = await getTreeRecursive(projectPath, 'src', 'master');

    const pageFiles = tree.filter(item => {
      if (item.type !== 'blob') return false;
      if (SKIP_PATTERNS.some(p => p.test(item.path))) return false;
      return /\.(tsx|jsx)$/.test(item.path);
    });

    console.log(`  ${pageFiles.length} tsx/jsx files`);

    for (const file of pageFiles.slice(0, 50)) {
      try {
        const content = await getFileContent(projectPath, file.path, 'master');
        if (!content) continue;

        const imports = extractImports(content);
        if (imports.length === 0) continue;

        patterns.push({
          project: projectPath,
          filePath: file.path,
          imports,
          componentCombination: imports.flatMap(i => i.components),
        });
      } catch {
      }
    }
  } catch (err) {
    console.error(`  Error: ${err}`);
  }

  return patterns;
}

async function main() {
  const allPatterns: PatternEntry[] = [];

  for (const project of CONSOLE_PROJECTS) {
    console.log(`Processing ${project}...`);
    const patterns = await extractFromProject(project);
    allPatterns.push(...patterns);
    console.log(`  → ${patterns.length} patterns extracted`);
  }

  const outDir = path.join(__dirname, '..', 'patterns');
  fs.mkdirSync(outDir, { recursive: true });

  const outFile = path.join(outDir, 'console-patterns.json');
  fs.writeFileSync(outFile, JSON.stringify(allPatterns, null, 2));
  console.log(`\nTotal: ${allPatterns.length} patterns → ${outFile}`);

  const comboCount = new Map<string, number>();
  for (const p of allPatterns) {
    const key = [...p.componentCombination].sort().join(' + ');
    comboCount.set(key, (comboCount.get(key) || 0) + 1);
  }

  const topCombos = [...comboCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30);

  const summaryFile = path.join(outDir, 'combo-frequency.json');
  fs.writeFileSync(summaryFile, JSON.stringify(topCombos, null, 2));
  console.log(`Top ${topCombos.length} combos → ${summaryFile}`);
}

main().catch(console.error);
