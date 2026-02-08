# ResourceId

> Console 业务组件 — **仅可在控制台项目中使用**

控制台资源 ID 展示组件。

## 引入

```jsx
import { ResourceId } from 'common-components';
```

## Props

*Props 信息待补充*

## 用法示例

> 注意：示例中的 `CommonComponents` 是文档环境变量，实际使用时直接 import

```jsx
() => {
    const { ResourceId } = CommonComponents;

    return <ResourceId value="uhost-0ji5hjxzastq" />;
};
```

```jsx
() => {
    const { ResourceId } = CommonComponents;

    return (
        <div style={{ width: 20 }}>
            <ResourceId value="uhost-0ji5hjxzastq" />
        </div>
    );
};
```

```jsx
() => {
    const { ResourceId } = CommonComponents;

    return (
        <div style={{ width: 20 }}>
            <ResourceId value="uhost-0ji5hjxzastq" showCopy />
        </div>
    );
};
```

## 注意事项

- ⚠️ **仅限控制台项目** — 依赖控制台框架的 services、登录态、地域等能力
- 在 `.console/dependences.js` 中添加 `'common-components'` 进行引入
- 不可在独立 React 项目或 Sandpack 预览中使用

---
*source: auto-sync from console/common-components*
