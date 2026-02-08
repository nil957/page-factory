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
