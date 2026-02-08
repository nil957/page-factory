# Tag

> Console 业务组件 — **仅可在控制台项目中使用**

业务组组件, 用于业务组相关的公共逻辑处理。

## 引入

```jsx
import { Tag } from 'common-components';
```

## Props

*Props 信息需要从源码 propTypes 提取，建议手动补充*

## 用法示例

> 注意：示例中的 `CommonComponents` 是文档环境变量，实际使用时直接 import

```jsx
() => {
    const { useState } = React;
    const { Tag } = CommonComponents;
    const { Box, Modal, Button, Form } = Components;
    const [visible, setVisible] = useState(false);
    const itemLayout = { labelCol: { span: 2 }, controllerCol: { offset: 2 } };

    const onButtonClick = () => {
        setVisible(true);
    };

    const onTagChange = tagValue => {
        console.log(tagValue);
    };

    return (
        <Box>
            <Button onClick={onButtonClick}>Click</Button>
            <Modal title="业务组" visible={visible} onClose={() => setVisible(false)} destroyOnClose>
                <Modal.Content>
                    <Form>
                        <Tag itemLayout={itemLayout} onChange={onTagChange} />
                    </Form>
                </Modal.Content>
            </Modal>
        </Box>
    );
};
```

```jsx
() => {
    const { useState } = React;
    const { Tag } = CommonComponents;
    const { Box, Modal, Button, Form, Switch } = Components;
    const [visible, setVisible] = useState(false);
    const itemLayout = { labelCol: { span: 2 }, controllerCol: { offset: 2 } };

    const [tagValue, setTagVal] = useState('你猜不到');
    const [value, setVal] = useState(false);
    const onButtonClick = () => {
        setVisible(true);
    };

    const onTagChange = tagValue => {
        console.log(tagValue);
        setTagVal(tagValue);
    };

    return (
        <Box>
            <Button onClick={onButtonClick}>Click</Button>
            <Modal title="业务组" visible={visible} onClose={() => setVisible(false)} destroyOnClose>
                <Modal.Content>
                    <div>
                        开启不存在值清空属性：
                        <Switch
                            checked={value}
                            onChange={val => {
                                setVal(val);
                            }}
                        />
                    </div>
                    <br />
                    <Form>
                        <Tag itemLayout={itemLayout} onChange={onTagChange} value={tagValue} clearNonExist={value} />
                    </Form>
                </Modal.Content>
            </Modal>
        </Box>
    );
};
```

## 注意事项

- ⚠️ **仅限控制台项目** — 依赖控制台框架的 services、登录态、地域等能力
- 在 `.console/dependences.js` 中添加 `'common-components'` 进行引入
- 不可在独立 React 项目或 Sandpack 预览中使用

---
*source: auto-sync from console/common-components*
