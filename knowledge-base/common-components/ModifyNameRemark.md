# ModifyNameRemark

> Console 业务组件 — **仅可在控制台项目中使用**

修改名称备注弹窗。

## 引入

```jsx
import { ModifyNameRemark } from 'common-components';
```

## Props

| 属性 | 类型 | 说明 |
|------|------|------|
| visible | bool (必填) | - |
| nameProps | objectOf | - |
| value | string | - |
| isEdit | bool | - |
| rules | array | - |
| remarkProps | objectOf | - |
| value | string | - |
| rules | array | - |
| configProps | objectOf | - |
| customTitleWidth | number | - |
| dataSource | arrayOf | - |
| title | node | - |
| titleTip | node | - |
| content | node | - |
| extra | node | - |
| onOk | func | - |
| onClose | func | - |
| restProps | object | - |

## 用法示例

> 注意：示例中的 `CommonComponents` 是文档环境变量，实际使用时直接 import

```jsx
() => {
    const { useState } = React;
    const { ModifyNameRemark } = CommonComponents;
    const { Button, Form, Input } = Components;
    const [visible, setVisible] = useState(false);

    const { Item } = Form;
    const horizontalLayout = {
        labelCol: {
            span: 3
        },
        controllerCol: {
            span: 9
        }
    };

    async function handleOk(record, helper) {
        const action2 = data =>
            new Promise(resolve => {
                setTimeout(() => {
                    console.log('action2', data);
                    resolve({ RetCode: 0 });
                }, 2000);
            });

        helper.loading(true);
        const res = await action2(record);
        helper.error('修改名称出错');
    }

    function onButtonClick() {
        setVisible(true);
    }

    return (
        <div>
            <Button onClick={onButtonClick}>Click</Button>
            {visible && (
                <ModifyNameRemark
                    visible={visible}
                    nameProps={{ value: '这是名称' }}
                    onOk={handleOk}
                    onClose={() => setVisible(false)}
                    configProps={{
                        customTitleWidth: 100,
                        dataSource: [
                            { title: '自定义标题', content: '文本内容' },
                            { title: '自定义标题', content: '文本内容' }
                        ]
                    }}
                    remarkProps={{ value: '这是备注' }}
                />
            )}
        </div>
    );
};
```

```jsx
() => {
    const { useState } = React;
    const { ModifyNameRemark } = CommonComponents;
    const { Button, Form, Input } = Components;
    const [visible, setVisible] = useState(false);

    const { Item } = Form;
    const horizontalLayout = {
        labelCol: {
            span: 3
        },
        controllerCol: {
            span: 9
        }
    };

    async function handleOk(record, helper) {
        const action1 = data =>
            new Promise(resolve => {
                setTimeout(() => {
                    console.log('action1', data);
                    resolve({ RetCode: 0 });
                }, 2000);
            });

        helper.loading(true);
        const res = await action1(record);
        helper.error('api 出错了！');
    }

    function onButtonClick() {
        setVisible(true);
    }

    return (
        <div>
            <Button onClick={onButtonClick}>Click</Button>
            {visible && (
                <ModifyNameRemark
                    visible={visible}
                    nameProps={{ value: '这是名称' }}
                    remarkProps={{ value: '这是备注' }}
                    onOk={handleOk}
                    onClose={() => setVisible(false)}
                />
            )}
        </div>
    );
};
```

```jsx
() => {
    const { useState } = React;
    const { ModifyNameRemark } = CommonComponents;
    const { Button, Form, Input } = Components;
    const [visible, setVisible] = useState(false);

    const { Item } = Form;
    const horizontalLayout = {
        labelCol: {
            span: 3
        },
        controllerCol: {
            span: 9
        }
    };

    async function handleOk(record, helper) {
        const action2 = data =>
            new Promise(resolve => {
                setTimeout(() => {
                    console.log('action2', data);
                    resolve({ RetCode: 0 });
                }, 2000);
            });

        helper.loading(true);
        const res = await action2(record);
        helper.success();
        setVisible(false);
    }

    function onButtonClick() {
        setVisible(true);
    }

    return (
        <div>
            <Button onClick={onButtonClick}>Click</Button>
            {visible && (
                <ModifyNameRemark
                    visible={visible}
                    onOk={handleOk}
                    configProps={{
                        customTitleWidth: 100,
                        dataSource: [{ title: '资源名称', content: '文本内容' }]
                    }}
                    remarkProps={{ value: '这是备注' }}
                    onClose={() => setVisible(false)}
                />
            )}
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
