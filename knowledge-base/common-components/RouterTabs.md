# RouterTabs

> Console 业务组件 — **仅可在控制台项目中使用**

Tab 路由切换，用于子产品或详情页内子模块的切换。

## 引入

```jsx
import { RouterTabs } from 'common-components';
```

## Props

*Props 信息待补充*

## 用法示例

> 注意：示例中的 `CommonComponents` 是文档环境变量，实际使用时直接 import

```jsx
() => {
    const { BrowserRouter: Router, Route, Switch, Redirect } = ReactRouterDOM;
    const { RouterTabs } = CommonComponents;
    const routes = [
        {
            tab: '主机管理',
            component: () => <div>主机管理</div>,
            key: 'manage',
            path: '/uhost/manage',
            link: '/uhost/manage'
        },
        {
            tab: '磁盘管理',
            component: () => <div>磁盘管理</div>,
            key: 'disk',
            path: '/uhost/disk',
            link: '/uhost/disk'
        }
    ];
    return (
        <div style={{ height: '200px' }}>
            <Router basename="/components-examples/common-components/">
                <Switch>
                    <Route
                        /** 将 tabs 中的匹配路径全部引导至这个路由 */
                        path={routes.map(route => route.path)}
                        render={({ location }) => (
                            /** tabs 中需要 location 来匹配当前路由 */
                            <RouterTabs
                                header={{ icon: 'uhost', content: '云主机' }}
                                routes={routes}
                                location={location}
                            />
                        )}
                    />
                    {/** 通过 redirect 来将错误的地址引导回首页 */}
                    <Route render={() => <Redirect to="/uhost/manage" />} />
                </Switch>
            </Router>
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
