# Hovertip

> UDesign Pro 组件

## 引入

```tsx
// 从主包引入
import { Hovertip } from '@ucloud/pro-components';
// 或从子包引入（推荐，减少打包体积）
import { Hovertip } from '@ucloud/pro-hovertip';
```

## Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| popup | `React.ReactNode` | ❌ | 弹出层内容 |
| contentStyle | `object` | ❌ | 内容部分样式 |
| tipStyle | `object` | ❌ | 提示部分样式 |
| children | `React.ReactNode` | ❌ | - |
| icon | `React.ReactNode` | ❌ | 图标，传入string时为图标类型，也可直接传入图标组件 |

## 完整 API 文档

详见 [在线文档](http://console-ops.page.ucloudadmin.com/pro-components/components/hovertip)

## 注意事项

- 安装需使用内部 npm registry: `--registry=http://registry.npm.pre.ucloudadmin.com`
- 可在任意 React 项目中使用（不依赖控制台环境）

---
*source: auto-sync from console-ops/pro-components*
