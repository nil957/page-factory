# Password

> Console 业务组件 — **仅可在控制台项目中使用**

用于资源创建输入密码、资源密码重置等场景。

## 引入

```jsx
import { Password } from 'common-components';
```

## Props

*Props 信息需要从源码 propTypes 提取，建议手动补充*

## 用法示例

> 注意：示例中的 `CommonComponents` 是文档环境变量，实际使用时直接 import

```jsx
() => {
    const { Box } = Components;
    const { Password } = CommonComponents;
    const calStrength = React.useCallback(v => {
        if (v.length < 7) return 1;
        let strength = 1;
        if (/\d+/.test(v) && /[a-zA-Z]+/.test(v)) strength++;
        if (/[*&^%$#@_]+/.test(v)) strength++;
        return strength;
    }, []);

    return (
        <Box container direction="column" spacing="md">
            <Password onChange={console.log} />
            <Password onChange={console.log} tips={['密码提示']} />
            <Password onChange={console.log} defaultShowPassword passwordGenerator />
            <Password onChange={console.log} calStrength={calStrength} />
        </Box>
    );
};
```

```jsx
() => {
    const { Box } = Components;
    const { Password } = CommonComponents;
    return (
        <Box container direction="column" spacing="md">
            <Password onChange={console.log} defaultShowPassword passwordGenerator placeholder="默认" />
            <Password onChange={console.log} defaultShowPassword passwordGenerator="v2" placeholder="v2" />
            <Password
                onChange={console.log}
                defaultShowPassword
                passwordGenerator={{ length: 10 }}
                placeholder="length 10"
            />
            <Password
                onChange={console.log}
                defaultShowPassword
                passwordGenerator={{ length: [10, 20] }}
                placeholder="length 10-20"
            />
            <Password
                onChange={console.log}
                defaultShowPassword
                passwordGenerator={{ symbols: true }}
                placeholder="symbols true"
            />
            <Password
                onChange={console.log}
                defaultShowPassword
                passwordGenerator={{ symbols: '@#!*#' }}
                placeholder="custom symbols"
            />
        </Box>
    );
};
```

```jsx
() => {
    const { Box } = Components;
    const { Password } = CommonComponents;

    const [password, setPassword] = React.useState('');
    const defaultPassword = 'xxx';

    return (
        <Box container direction="column" spacing="md">
            <Password onChange={console.log} defaultShowPassword defaultValue={defaultPassword} />
            <Password
                onChange={v => {
                    Math.random() < 0.5 && setPassword(v);
                }}
                value={password}
            />
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
