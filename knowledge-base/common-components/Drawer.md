# Drawer

> Console 业务组件 — **仅可在控制台项目中使用**

Drawer 组件是基于基础组件[@ucloud-fe/react-components](https://github.com/UCloud-FE/react-components)进行封装的，可供控制台项目使用。

## 引入

```jsx
import { Drawer } from 'common-components';
```

## Props

*Props 信息待补充*

## 用法示例

> 注意：示例中的 `CommonComponents` 是文档环境变量，实际使用时直接 import

```jsx
() => {
    const { useState } = React;
    const { Drawer } = CommonComponents;
    const { Button } = Components;
    const [visible, setVisible] = useState(false);

    return (
        <div>
            <Button onClick={() => setVisible(true)}>点击</Button>
            <Drawer visible={visible} size="lg" destroyOnClose onClose={() => setVisible(false)} localKey='drawer-demo-test'>
                <div style={{ margin: 20 }}>这是业务组件Drawer</div>
            </Drawer>
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
