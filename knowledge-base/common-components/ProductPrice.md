# ProductPrice

> Console 业务组件 — **仅可在控制台项目中使用**

产品定价页面组件，用于产品跳转到对应定价页面

## 引入

```jsx
import { ProductPrice } from 'common-components';
```

## Props

| 属性 | 类型 | 说明 |
|------|------|------|
| linkKey | string (必填) | - |
| size | oneOf | - |
| className | string | - |
| style | object | - |

## 用法示例

> 注意：示例中的 `CommonComponents` 是文档环境变量，实际使用时直接 import

```jsx
() => {
    const { ProductPrice } = CommonComponents;
    return <ProductPrice size="md" linkKey="uhostCalculator" />;
};
```

```jsx
() => {
    const { ProductPrice } = CommonComponents;
    return <ProductPrice.SoldOutTip size="md" linkKey="uhostCalculator" />;
};
```

```jsx
() => {
    const { ProductPrice } = CommonComponents;
    return <ProductPrice.NoResourceTip size="lg" linkKey="uhostCalculator" />;
};
```

## 注意事项

- ⚠️ **仅限控制台项目** — 依赖控制台框架的 services、登录态、地域等能力
- 在 `.console/dependences.js` 中添加 `'common-components'` 进行引入
- 不可在独立 React 项目或 Sandpack 预览中使用

---
*source: auto-sync from console/common-components*
