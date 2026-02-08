# Drawer

> UDesign Pro 组件

## 引入

```tsx
// 从主包引入
import { Drawer } from '@ucloud/pro-components';
// 或从子包引入（推荐，减少打包体积）
import { Drawer } from '@ucloud/pro-drawer';
```

## Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| className | `string` | ❌ | - |
| title | `React.ReactNode | string` | ❌ | 抽屉的标题 |
| titleExtra | `React.ReactNode | string` | ❌ | 抽屉的标题下方的插槽 |
| titleExtraClassName | `string` | ❌ | 抽屉的标题下方的插槽的类名 |
| footer | `boolean | React.ReactNode` | ❌ | 抽屉的底部 |
| loading | `boolean` | ❌ | 是否加载中 |
| width | `number | string` | ❌ | 抽屉宽度 |
| children | `React.ReactNode` | ❌ | @ignore children |
| onOk | `(e: React.MouseEvent<HTMLElement>) => void` | ❌ | - |
| tips | `string | React.ReactNode` | ❌ | - |
| error | `string | React.ReactNode` | ❌ | - |
| cancelText | `string | React.ReactNode` | ❌ | - |
| okText | `string | React.ReactNode` | ❌ | - |
| hideOkButton | `boolean` | ❌ | - |
| hideCancelButton | `boolean` | ❌ | - |
| okButtonProps | `ButtonProps` | ❌ | 确定按钮 props |
| cancelButtonProps | `ButtonProps` | ❌ | 取消按钮 props |
| key | `string` | ❌ | tab的唯一key |
| tab | `React.ReactNode` | ❌ | tab的title内容 |
| forceRender | `boolean` | ❌ | 是否强制渲染 |
| disabled | `boolean` | ❌ | 是否禁用 |
| content | `React.ReactNode` | ❌ | 建议自定义ProDrawer中的children，若使用content,Notice/边距等均需自定义 |
| activeKey | `string` | ❌ | 当前激活的tab key，受控 |
| defaultActiveKey | `string` | ❌ | 默认激活的tab key，非受控 |
| onChange | `(activeKey: string) => void` | ❌ | tab修改时的回调 |
| destroyInactiveTabPane | `boolean` | ❌ | 是否销毁不展示的tab内容 |
| panes | `paneShape[]` | ❌ | tabs的面板 |

## 完整 API 文档

详见 [在线文档](http://console-ops.page.ucloudadmin.com/pro-components/components/drawer)

## 注意事项

- 安装需使用内部 npm registry: `--registry=http://registry.npm.pre.ucloudadmin.com`
- 可在任意 React 项目中使用（不依赖控制台环境）

---
*source: auto-sync from console-ops/pro-components*
