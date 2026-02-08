# ProductLayout

> UDesign Pro 组件

## 引入

```tsx
// 从主包引入
import { ProductLayout } from '@ucloud/pro-components';
// 或从子包引入（推荐，减少打包体积）
import { ProductLayout } from '@ucloud/pro-product-layout';
```

## Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| icon | `string | React.ReactNode` | ❌ | 图标，传入string时为图标类型，也可直接传入图标组件 |
| prefix | `string` | ❌ | icon类名前缀，当icon为图标组件时，会被忽略 |
| content | `React.ReactNode` | ❌ | 产品页头的内容 |
| extra | `React.ReactNode` | ❌ | 右侧操作区域，通常为一些入口链接 |
| content | `React.ReactNode` | ❌ | 产品页脚的内容 |
| colSpan | `number` | ❌ | 页脚的内容所占栅格数，用于与内容区对齐 |
| header | `headerShape` | ❌ | 产品页头，不传则不显示页头 |
| footer | `footerShape` | ❌ | 页脚的内容，不传则不显示页脚 |
| className | `string` | ❌ | @ignore |
| style | `React.CSSProperties` | ❌ | @ignore |
| children | `React.ReactNode` | ❌ | @ignore |
| className | `string` | ❌ | @ignore |
| style | `React.CSSProperties` | ❌ | @ignore |
| children | `React.ReactNode` | ❌ | @ignore |
| icon | `string | React.ReactNode` | ❌ | 图标，传入string时为图标类型，也可直接传入图标组件 |
| prefix | `string` | ❌ | icon类名前缀，当icon为图标组件时，会被忽略 |
| onClick | `(e: React.MouseEvent<HTMLAnchorElement>) => void` | ❌ | 点击时的回调 |
| href | `string` | ❌ | 点击跳转的地址，指定此属性，则行为与a链接一致 |
| target | `string` | ❌ | 相当于a链接的target属性，href存在时生效 |
| className | `string` | ❌ | @ignore |
| style | `React.CSSProperties` | ❌ | @ignore |
| children | `React.ReactNode` | ❌ | @ignore |
| colSpan | `number` | ❌ | 内容所占栅格格数 |
| className | `string` | ❌ | @ignore |
| style | `React.CSSProperties` | ❌ | @ignore |
| children | `React.ReactNode` | ❌ | @ignore |
| icon | `string | React.ReactNode` | ❌ | 图标，传入string时为图标类型，也可直接传入图标组件 |
| prefix | `string` | ❌ | icon类名前缀，当icon为图标组件时，会被忽略 |
| extra | `React.ReactNode` | ❌ | 右侧操作区域，通常为一些入口链接 |
| className | `string` | ❌ | @ignore |
| style | `React.CSSProperties` | ❌ | @ignore |
| children | `React.ReactNode` | ❌ | @ignore |
| key | `string` | ❌ | tab的唯一key |
| tab | `React.ReactNode` | ❌ | tab的title内容 |
| forceRender | `boolean` | ❌ | 是否强制渲染 |
| disabled | `boolean` | ❌ | 是否禁用 |
| content | `React.ReactNode` | ❌ | 面板的内容 |
| activeKey | `string` | ❌ | 当前激活的tab key，受控 |
| defaultActiveKey | `string` | ❌ | 默认激活的tab key，非受控 |
| onChange | `(activeKey: string) => void` | ❌ | tab修改时的回调 |
| destroyInactiveTabPane | `boolean` | ❌ | 是否销毁不展示的tab内容 |
| panes | `paneShape[]` | ❌ | tabs的面板 |

## 完整 API 文档

详见 [在线文档](http://console-ops.page.ucloudadmin.com/pro-components/components/product-layout)

## 注意事项

- 安装需使用内部 npm registry: `--registry=http://registry.npm.pre.ucloudadmin.com`
- 可在任意 React 项目中使用（不依赖控制台环境）

---
*source: auto-sync from console-ops/pro-components*
