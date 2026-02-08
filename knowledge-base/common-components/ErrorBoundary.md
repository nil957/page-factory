# ErrorBoundary

> Console 业务组件 — **仅可在控制台项目中使用**

部分 UI 中的 JavaScript 错误不应该破坏整个应用程序。故引入错误边界组件, 注意包裹部分需为组件，含有生命周期才能有效果！

## 引入

```jsx
import { ErrorBoundary } from 'common-components';
```

## Props

*Props 信息需要从源码 propTypes 提取，建议手动补充*

## 注意事项

- ⚠️ **仅限控制台项目** — 依赖控制台框架的 services、登录态、地域等能力
- 在 `.console/dependences.js` 中添加 `'common-components'` 进行引入
- 不可在独立 React 项目或 Sandpack 预览中使用

---
*source: auto-sync from console/common-components*
