# LoginConfig

> Console 业务组件 — **仅可在控制台项目中使用**

登陆方式组件。

## 引入

```jsx
import { LoginConfig } from 'common-components';
```

## Props

*Props 信息需要从源码 propTypes 提取，建议手动补充*

## 用法示例

> 注意：示例中的 `CommonComponents` 是文档环境变量，实际使用时直接 import

```jsx
() => {
    const { useState } = React;
    const { Modal, LoginConfig } = CommonComponents;
    const { Button } = Components;

    const ImageSetMock = {
        Zone: 'cn-bj2-05',
        ImageId: 'uimage-upznxr',
        ImageName: 'Debian 10.0 64位',
        OsType: 'Linux',
        OsName: 'Debian 10.0 64位',
        ImageType: 'Base',
        Features: ['NetEnhanced', 'NetEnhanced_Ultra', 'RssdAttachable', 'CloudInit'],
        FuncType: '',
        IntegratedSoftware: '',
        Vendor: '',
        Links: '',
        State: 'Available',
        ImageDescription: '',
        CreateTime: 1625818055,
        ImageSize: 20,
        MaintainEol: '2024/06/30',
        ActualSize: 3616,
        SupportedGPUTypes: [],
        SceneCategories: [],
        PrimarySoftware: '',
        Tag: 'Default'
    };
    const itemLayout = {
        labelCol: {
            span: 3
        },
        controllerCol: {
            span: 9
        }
    };
    const [loginMode, setLoginMode] = useState('Password');
    const [passwordError, setPasswordError] = useState('');
    const [password, setPassword] = useState('');
    function handleLoginModeChange(val) {
        setLoginMode(val);
    }
    function handlePasswordChange(password, err) {
        console.log('password', password);
        setPassword(password);
        setPasswordError(err);
    }
    return (
        <div>
            <LoginConfig
                image={ImageSetMock}
                loginMode={loginMode}
                renderModes={['Password', 'Later']}
                password={password}
                passwordError={passwordError}
                onLoginModeChange={handleLoginModeChange}
                onPasswordChange={handlePasswordChange}
                itemLayout={itemLayout}
                renderType={'tabs'}
            />
        </div>
    );
};
```

```jsx
() => {
    const { useState } = React;
    const { Modal, LoginConfig } = CommonComponents;
    const { Button } = Components;

    const ImageSetMock = {
        Zone: 'cn-bj2-05',
        ImageId: 'uimage-upznxr',
        ImageName: 'Debian 10.0 64位',
        OsType: 'Linux',
        OsName: 'Debian 10.0 64位',
        ImageType: 'Base',
        Features: ['NetEnhanced', 'NetEnhanced_Ultra', 'RssdAttachable', 'CloudInit'],
        FuncType: '',
        IntegratedSoftware: '',
        Vendor: '',
        Links: '',
        State: 'Available',
        ImageDescription: '',
        CreateTime: 1625818055,
        ImageSize: 20,
        MaintainEol: '2024/06/30',
        ActualSize: 3616,
        SupportedGPUTypes: [],
        SceneCategories: [],
        PrimarySoftware: '',
        Tag: 'Default'
    };
    const itemLayout = {
        labelCol: {
            span: 3
        },
        controllerCol: {
            span: 9
        }
    };
    const [loginMode, setLoginMode] = useState('Password');
    const [passwordError, setPasswordError] = useState('');
    const [password, setPassword] = useState('');
    function handleLoginModeChange(val) {
        setLoginMode(val);
    }
    function handlePasswordChange(password, err) {
        console.log('password', password);
        setPassword(password);
        setPasswordError(err);
    }
    return (
        <div>
            <LoginConfig
                image={ImageSetMock}
                loginMode={loginMode}
                renderModes={['Password', 'Later']}
                password={password}
                passwordError={passwordError}
                onLoginModeChange={handleLoginModeChange}
                onPasswordChange={handlePasswordChange}
                itemLayout={{}}
                renderType={'form'}
            />
        </div>
    );
};
```

```jsx
() => {
    const { useState } = React;
    const { Modal, LoginConfig } = CommonComponents;
    const { Button } = Components;

    const ImageSetMock = {
        Zone: 'cn-bj2-05',
        ImageId: 'uimage-upznxr',
        ImageName: 'Debian 10.0 64位',
        OsType: 'Linux',
        OsName: 'Debian 10.0 64位',
        ImageType: 'Base',
        Features: ['NetEnhanced', 'NetEnhanced_Ultra', 'RssdAttachable', 'CloudInit'],
        FuncType: '',
        IntegratedSoftware: '',
        Vendor: '',
        Links: '',
        State: 'Available',
        ImageDescription: '',
        CreateTime: 1625818055,
        ImageSize: 20,
        MaintainEol: '2024/06/30',
        ActualSize: 3616,
        SupportedGPUTypes: [],
        SceneCategories: [],
        PrimarySoftware: '',
        Tag: 'Default'
    };
    const itemLayout = {
        labelCol: {
            span: 3
        },
        controllerCol: {
            span: 9
        }
    };
    const [loginMode, setLoginMode] = useState('Password');
    const [passwordError, setPasswordError] = useState('');
    const [password, setPassword] = useState('');
    function handleLoginModeChange(val) {
        setLoginMode(val);
    }
    function handlePasswordChange(password, err) {
        console.log('password', password);
        setPassword(password);
        setPasswordError(err);
    }
    return (
        <div>
            <LoginConfig
                image={ImageSetMock}
                loginMode={loginMode}
                renderModes={['Password']}
                password={password}
                passwordError={passwordError}
                onLoginModeChange={handleLoginModeChange}
                onPasswordChange={handlePasswordChange}
                itemLayout={{}}
                renderType={'form'}
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
