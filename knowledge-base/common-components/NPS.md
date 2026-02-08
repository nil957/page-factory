# NPS

> Console 业务组件 — **仅可在控制台项目中使用**

NPS 调研组件

## 引入

```jsx
import { NPS } from 'common-components';
```

## Props

*Props 信息待补充*

## 用法示例

> 注意：示例中的 `CommonComponents` 是文档环境变量，实际使用时直接 import

```jsx
() => {
    const { NPS } = CommonComponents;

    return (
        <div>
            <NPS productInfo={{ productKey: 'uhost' }} />
        </div>
    );
};
```

```jsx
() => {
    const { NPS } = CommonComponents;

    return (
        <div>
            <NPS
                productInfo={{
                    productKey: 'epc',
                    name: '云极高性能计算',
                    name_en: 'EPC'
                }}
            />
        </div>
    );
};
```

```jsx
() => {
    const { NPS } = CommonComponents;

    return (
        <div>
            <NPS
                productInfo={{
                    productKey: 'test'
                }}
                lablesData={{
                    verySatisfied: [
                        {
                            label: '评价aaa',
                            key: 'aaa',
                            selected: false
                        },
                        {
                            label: '评价bbb',
                            key: 'bbb',
                            selected: false
                        },
                        {
                            label: '评价ccc',
                            key: 'ccc',
                            selected: false
                        },
                        {
                            label: '评价ddd',
                            key: 'ddd',
                            selected: false
                        }
                    ],
                    dissatisfied: [
                        {
                            label: '评价111',
                            key: '111',
                            selected: false
                        },
                        {
                            label: '评价222',
                            key: '222',
                            selected: false
                        },
                        {
                            label: '评价333',
                            key: '333',
                            selected: false
                        },
                        {
                            label: '评价444',
                            key: '444',
                            selected: false
                        }
                    ]
                }}
            />
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
