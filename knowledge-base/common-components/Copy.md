# Copy

> Console 业务组件 — **仅可在控制台项目中使用**

用于 table 组件、卡片组件等场景的复制。

## 引入

```jsx
import { Copy } from 'common-components';
```

## Props

*Props 信息待补充*

## 用法示例

> 注意：示例中的 `CommonComponents` 是文档环境变量，实际使用时直接 import

```jsx
() => {
    const { Copy } = CommonComponents;
    return (
        <span>
            uhost-cuuidurd
            <Copy.Icon text="uhost-cuuidurd" />
        </span>
    );
};
```

```jsx
() => {
    const { Copy } = CommonComponents;

    return (
        <div>
            <div>
                自定义复制前&&复制后文案
                <Copy.Icon text="uhost-cuuidurd" tipContent={{ copyTip: '复制前文案', copiedTip: '复制后文案' }} />
            </div>
            <div>
                仅自定义复制前文案
                <Copy.Icon text="uhost-cuuidurd" tipContent={{ copyTip: '复制前文案' }} />
            </div>
            <div>
                支持传入node定义文案
                <Copy.Icon
                    text="uhost-cuuidurd"
                    tipContent={{ copiedTip: <span style={{ color: 'green' }}>复制后文案</span> }}
                />
            </div>
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
