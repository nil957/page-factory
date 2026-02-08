# Modal

> Console 业务组件 — **仅可在控制台项目中使用**

## 引入

```jsx
import { Modal } from 'common-components';
```

## Props

*Props 信息需要从源码 propTypes 提取，建议手动补充*

## 用法示例

> 注意：示例中的 `CommonComponents` 是文档环境变量，实际使用时直接 import

```jsx
() => {
    const { useState } = React;
    const { Modal } = CommonComponents;
    const { Button, Form, Input, Switch } = Components;
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hideOk, setHideOk] = useState(false);
    const [hideCancel, setHideCancel] = useState(false);
    const [disabledOk, setDisabledOk] = useState(false);
    const [disabledCancel, setDisabledCancel] = useState(false);
    const { Item } = Form;
    const itemLayout = {
        labelCol: {
            span: 3
        },
        controllerCol: {
            span: 9
        }
    };

    return (
        <div>
            <Form itemProps={{ ...itemLayout }}>
                <Item label="loading">
                    <Switch checked={loading} onChange={setLoading} />
                </Item>
                <Item label="hideOk">
                    <Switch checked={hideOk} onChange={setHideOk} />
                </Item>
                <Item label="hideCancel">
                    <Switch checked={hideCancel} onChange={setHideCancel} />
                </Item>
                <Item label="disabledOk">
                    <Switch checked={disabledOk} onChange={setDisabledOk} />
                </Item>
                <Item label="disabledCancel">
                    <Switch checked={disabledCancel} onChange={setDisabledCancel} />
                </Item>
            </Form>

            <Button onClick={() => setVisible(true)}>Toggle</Button>

            <Modal
                title="Modal demo"
                loading={loading}
                visible={visible}
                hideOk={hideOk}
                hideCancel={hideCancel}
                disabledOk={disabledOk}
                disabledCancel={disabledCancel}
                onOk={() => setVisible(false)}
                onClose={() => setVisible(false)}
            >
                <Form itemProps={{ ...itemLayout, shareStatus: true }}>
                    <Item label="名称">
                        <Input />
                    </Item>
                </Form>
            </Modal>
        </div>
    );
};
```

```jsx
() => {
    const { useState } = React;
    const { Modal } = CommonComponents;
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
    function onButtonClick() {
        setVisible(true);
    }

    return (
        <div>
            <Button onClick={onButtonClick}>Click</Button>
            <Modal
                visible={visible}
                title="Modal demo"
                error="api 出错了"
                onOk={() => setVisible(false)}
                onClose={() => setVisible(false)}
            >
                <Form itemProps={{ ...horizontalLayout, shareStatus: true }}>
                    <Item label="名称">
                        <Input />
                    </Item>
                </Form>
            </Modal>
        </div>
    );
};
```

```jsx
() => {
    const { useState } = React;
    const { Modal } = CommonComponents;
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
    function onButtonClick() {
        setVisible(true);
    }

    return (
        <div>
            <Button onClick={onButtonClick}>Click</Button>
            <Modal
                visible={visible}
                title="Modal demo"
                tips="api 出错了"
                onOk={() => setVisible(false)}
                onClose={() => setVisible(false)}
            >
                <Form itemProps={{ ...horizontalLayout, shareStatus: true }}>
                    <Item label="名称">
                        <Input />
                    </Item>
                </Form>
            </Modal>
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
