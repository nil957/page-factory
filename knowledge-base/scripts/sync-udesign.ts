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
