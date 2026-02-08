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
