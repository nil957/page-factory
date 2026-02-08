# ExportBtn

> UDesign Pro 组件

## 引入

```tsx
// 从主包引入
import { ExportBtn } from '@ucloud/pro-components';
// 或从子包引入（推荐，减少打包体积）
import { ExportBtn } from '@ucloud/pro-export-btn';
```

## Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| _renderExcel | `(v: any, row: any) => React.ReactNode` | ❌ | - |
| desc | `[]` | ❌ | - |
| label | `React.ReactNode` | ❌ | - |
| downType | `'csv' | 'excel' | 'custom'` | ❌ | - |
| icon | `React.ReactNode` | ❌ | - |
| size | `Size` | ❌ | - |
| handleExport | `(` | ✅ | - |
| fn | `<T>(` | ✅ | - |
| data | `T[],` | ✅ | - |
| schema | `ColumnType[],` | ✅ | - |
| filename | `string | undefined,` | ❌ | - |
| children | `React.ReactNode` | ❌ | - |
| data | `any[]` | ✅ | 数据源 |
| schema | `ColumnType[]` | ✅ | Udesign Table Column |
| filename | `string` | ❌ | 导出文件名 |
| data | `any[],` | ✅ | 数据源 |
| schema | `ColumnType[],` | ✅ | Udesign Table Column |
| filename | `string,` | ❌ | 导出文件名 |

## 完整 API 文档

详见 [在线文档](http://console-ops.page.ucloudadmin.com/pro-components/components/export-btn)

## 注意事项

- 安装需使用内部 npm registry: `--registry=http://registry.npm.pre.ucloudadmin.com`
- 可在任意 React 项目中使用（不依赖控制台环境）

---
*source: auto-sync from console-ops/pro-components*
