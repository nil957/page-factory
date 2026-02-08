# 知识库 Schema 与维护指南

## 目录结构

```
knowledge-base/
├── registry.json                 # 核心：三套组件库注册表（~120 个组件）
├── conflict-rules.json           # 核心：重名冲突消歧规则（16 条）
├── page-templates.json           # 核心：页面模板定义（8 种页面类型）
├── system-prompt-template.md     # AI System Prompt 生成模板
├── schema.md                     # 本文件 — 维护指南
│
├── udesign/                      # UDesign 组件详细文档
│   ├── Button.md
│   ├── Table.md
│   ├── Modal.md
│   └── ...                       # 每个组件一个 .md 文件
│
├── udesign-pro/                  # UDesign-Pro 组件详细文档
│   ├── ProForm.md
│   ├── ProTable.md
│   └── ...
│
├── common-components/            # 控制台业务组件详细文档
│   ├── RegionZone.md
│   ├── BatchModal.md
│   ├── Form.md
│   └── ...
│
├── patterns/                     # 从真实项目提取的组合模式
│   ├── resource-list-page.md
│   ├── create-resource-page.md
│   └── ...
│
└── scripts/                      # 自动化同步脚本
    ├── sync-udesign.ts
    ├── sync-pro.ts
    ├── sync-common.ts
    └── extract-patterns.ts
```

---

## 核心文件 Schema

### registry.json

组件注册表，知识库的索引入口。

**每个组件条目字段**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | ✅ | 组件名，如 `"RegionZone"` |
| `library` | enum | ✅ | `"udesign"` \| `"udesign-pro"` \| `"common-components"` |
| `category` | string | ✅ | 分类，见 `categories` 定义 |
| `import` | string | ✅ | 完整 import 语句 |
| `description` | string | ✅ | 一句话描述（50字内） |
| `keywords` | string[] | ✅ | 用户需求匹配关键词（中英文） |
| `hasConflict` | boolean | ✅ | 是否与其他库有同名/同功能冲突 |
| `conflictWith` | string[] | ❌ | 冲突的组件，格式 `"库名/组件名"` |
| `docFile` | string | ✅ | 详细文档路径，相对于 knowledge-base/ |
| `subComponents` | string[] | ❌ | 子组件列表（如 Form 的 23 个子组件） |
| `subPackage` | string | ❌ | Pro 组件的独立子包名 |
| `notes` | string | ❌ | 重要注意事项 |

**新增组件操作**：
1. 在 `components` 数组中添加新条目
2. 在对应库目录下创建 `.md` 详细文档
3. 如果有冲突，同时更新 `conflict-rules.json`

### conflict-rules.json

重名冲突消歧规则。

**每条冲突规则字段**：

| 字段 | 类型 | 说明 |
|------|------|------|
| `componentName` | string | 冲突的组件名 |
| `involvedLibraries` | string[] | 涉及的库 |
| `console` | object | 控制台项目应使用的库、import、原因 |
| `standalone` | object | 独立项目应使用的库、import、原因 |
| `note` | string | 补充说明 |

特殊情况：当同一个环境下也需要按场景区分时（如 Tag），使用 `useMap` 代替 `use`。

### page-templates.json

页面模板定义，帮助 AI 快速匹配页面类型。

每个模板字段：`id`, `name`, `description`, `applicableTo`, `components`（按环境分 required/optional）, `skeleton`（文件骨架）, `exampleProjects`。

---

## 组件详细文档格式

每个组件的 `.md` 文件遵循统一格式：

```markdown
# ComponentName

> 一句话描述

## 引入

\`\`\`tsx
import { ComponentName } from 'library-name';
\`\`\`

## Props

| 属性 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| prop1 | string | - | ✅ | ... |
| prop2 | boolean | false | ❌ | ... |

## 基本用法

\`\`\`tsx
<ComponentName prop1="value" />
\`\`\`

## 常见场景

### 场景1：xxx

\`\`\`tsx
// 完整代码示例
\`\`\`

### 场景2：xxx

\`\`\`tsx
// 完整代码示例
\`\`\`

## 与其他组件配合

- 常与 XXX 组件一起使用
- 在 YYY 场景中，通常搭配 ZZZ

## 注意事项

- ⚠️ 重要提醒1
- ⚠️ 重要提醒2

## 常见错误

| 错误 | 原因 | 解决 |
|------|------|------|
| ... | ... | ... |
```

---

## 维护流程

### 日常维护（平台内编辑器）

1. 进入 **管理后台 → 知识库管理**
2. 按库筛选组件列表
3. 点击组件进入 Markdown 编辑器
4. 修改后点击保存
5. （可选）点击"测试 AI 效果"验证准确性

### 新增组件

1. **registry.json** 中添加组件条目
2. 对应库目录下创建 `.md` 文档（可先跑同步脚本自动生成初始版本）
3. 检查是否有冲突，有则更新 **conflict-rules.json**
4. 测试 AI 效果

### 自动同步（定期）

```bash
# 从 UDesign GitHub 同步
npx ts-node knowledge-base/scripts/sync-udesign.ts

# 从 Pro Components 同步
npx ts-node knowledge-base/scripts/sync-pro.ts

# 从 common-components GitLab 同步
npx ts-node knowledge-base/scripts/sync-common.ts

# 从 console/ 项目提取使用模式
npx ts-node knowledge-base/scripts/extract-patterns.ts
```

**同步规则**：
- 只更新 `source="auto-sync"` 且未被手动编辑过的记录
- 手动编辑过的文档不会被覆盖，只标记"有新版本可用"
- 同步后可在管理后台查看 diff 并决定是否合并

### 组件库版本升级

1. 跑对应的同步脚本
2. 在管理后台查看变更
3. 确认 Props 变更 → 更新文档
4. 确认新增组件 → 添加到 registry
5. 测试 AI 效果

---

## 关键指标

| 指标 | 目标 | 检查方法 |
|------|------|---------|
| 组件覆盖率 | 100% 的组件都有注册表条目 | `registry.json` 条目数 vs 组件库实际数量 |
| 文档完整率 | >90% 的组件有详细 .md 文档 | 检查 docFile 指向的文件是否存在 |
| 冲突覆盖率 | 100% 的重名组件有消歧规则 | `hasConflict=true` 的组件都在 conflict-rules.json 中 |
| AI 准确率 | >85% 的组件选择和 import 正确 | 测试集验证 |

---

## FAQ

**Q: 为什么不用向量数据库？**
A: 120 个组件的规模，关键词匹配比向量搜索更准确、更可控、更好维护。向量搜索适合海量文档模糊匹配场景。

**Q: registry.json 会不会太大？**
A: 120 个条目约 30KB，完全可控。它只是索引，详细文档在独立 .md 文件中。

**Q: AI 对话时会把所有组件文档都发给 LLM 吗？**
A: 不会。只发送与用户需求相关的 5-8 个组件的摘要。详细 Props 由 AI 通过 `lookup_component` tool 按需获取。

**Q: 如何判断文档质量好不好？**
A: 用"测试 AI 效果"功能——输入一个需求描述，看 AI 是否能正确使用该组件。如果 import 错误或 Props 用法错误，说明文档需要改进。
