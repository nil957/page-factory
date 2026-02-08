# ModifyPassword

> Console 业务组件 — **仅可在控制台项目中使用**

重置密码弹窗。

## 引入

```jsx
import { ModifyPassword } from 'common-components';
```

## Props

*Props 信息需要从源码 propTypes 提取，建议手动补充*

## 用法示例

> 注意：示例中的 `CommonComponents` 是文档环境变量，实际使用时直接 import

```jsx
() => {
    const { useState } = React;
    const { ModifyPassword } = CommonComponents;
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
            {visible && <ModifyPassword visible={visible} onOk={handleOk} onClose={() => setVisible(false)} />}
        </div>
    );
};
```

```jsx
() => {
    const { useState } = React;
    const { ModifyPassword } = CommonComponents;
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
                <ModifyPassword
                    visible={visible}
                    onOk={handleOk}
                    passwordProps={{
                        passwordGenerator: true
                    }}
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
    const { ModifyPassword } = CommonComponents;
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
                <ModifyPassword
                    visible={visible}
                    onOk={handleOk}
                    passwordProps={{
                        passwordGenerator: true
                    }}
                    confirmPasswordProps={{}}
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
