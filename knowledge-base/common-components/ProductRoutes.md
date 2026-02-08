# ProductRoutes

> Console 业务组件 — **仅可在控制台项目中使用**

用作产品的路由，将路由全部传入，会根据路由的 tab、tabGroup 来进行渲染，支持权限提示和 globalUI 配置

## 引入

```jsx
import { ProductRoutes } from 'common-components';
```

## Props

| 属性 | 类型 | 说明 |
|------|------|------|
| component | elementType | - |
| render | func | - |
| bitKey | string | - |
| globalUI | object | - |
| resetKeyMap | oneOfType | - |
| region | bool | - |
| zone | bool | - |
| project | bool | - |
| children | array | - |
| name | string | - |
| routeKey | string | - |
| routes | arrayOf | - |
| path | oneOfType | - |
| autoAvaliableZone | bool | - |

## 用法示例

> 注意：示例中的 `CommonComponents` 是文档环境变量，实际使用时直接 import

```jsx
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ProductRoutes } from 'common-components';

const UHostManage = () => <div>主机管理</div>;
const UDiskManage = () => <div>磁盘管理</div>;
const UHostDetail = () => <div>详情页</div>;
const routes = [
    {
        tab: '主机管理',
        component: UHostManage,
        key: 'manage',
        path: '/',
        exact: true
    },
    {
        tab: '磁盘管理',
        component: UDiskManage,
        key: 'disk'
    }
];
const Demo = () => {
    return (
        <div style={{ height: '400px' }}>
            <Router basename="/components-examples/common-components/">
                <ProductRoutes routes={routes} />
            </Router>
        </div>
    );
};
export default Demo;
```

```jsx
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ProductRoutes } from 'common-components';

const UHostManage = () => <div>主机管理</div>;
const UDiskManage = () => <div>磁盘管理</div>;
const UHostDetail = () => <div>详情页</div>;
const routes = [
    {
        tab: '主机管理',
        component: UHostManage,
        key: 'manage',
        path: '/',
        exact: true,
        bitKey: 'UHYBRID'
    },
    {
        tab: '磁盘管理',
        component: UDiskManage,
        key: 'disk'
    }
];

const Demo = () => {
    return (
        <div style={{ height: '400px' }}>
            <Router basename="/components-examples/common-components/">
                <ProductRoutes routes={routes} />
            </Router>
        </div>
    );
};

export default Demo;
```

```jsx
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ProductRoutes } from 'common-components';

const UHostManage = () => <div>主机管理</div>;
const UDiskManage = () => <div>磁盘管理</div>;
const UHostDetail = () => <div>详情页</div>;
const routes = [
    {
        tab: '主机管理',
        component: UHostManage,
        key: 'manage',
        path: '/',
        exact: true
    },
    {
        tab: '磁盘管理',
        component: UDiskManage,
        key: 'disk',
        globalUI: {
            region: {
                enable: false
            },
            zone: {
                show: false
            }
        }
    }
];

const Demo = () => {
    return (
        <div style={{ height: '400px' }}>
            <Router basename="/components-examples/common-components/">
                <ProductRoutes routes={routes} />
            </Router>
        </div>
    );
};
export default Demo;
```

## 注意事项

- ⚠️ **仅限控制台项目** — 依赖控制台框架的 services、登录态、地域等能力
- 在 `.console/dependences.js` 中添加 `'common-components'` 进行引入
- 不可在独立 React 项目或 Sandpack 预览中使用

---
*source: auto-sync from console/common-components*
