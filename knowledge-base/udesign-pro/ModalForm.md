# ModalForm

> UDesign Pro 组件

## 引入

```tsx
// 从主包引入
import { ModalForm } from '@ucloud/pro-components';
// 或从子包引入（推荐，减少打包体积）
import { ModalForm } from '@ucloud/pro-modal-form';
```

## Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | `React.ReactNode | string` | ❌ | 弹窗的标题 |
| footer | `boolean | React.ReactNode` | ❌ | 弹窗的底部 |
| loading | `boolean` | ❌ | 是否加载中 |
| children | `React.ReactNode` | ❌ | @ignore children |
| onOk | `(e: React.MouseEvent<HTMLElement>) => void` | ❌ | 成功的回调 |
| tips | `string | React.ReactNode` | ❌ | 顶部提示 |
| tipsType | `NoticeStyleTypeProps` | ❌ | 顶部提示状态 |
| error | `string | React.ReactNode` | ❌ | 错误提醒 |
| cancelText | `string | React.ReactNode` | ❌ | 取消文案 , 优先级比locale高 |
| okText | `string | React.ReactNode` | ❌ | 确定文案 , 优先级比locale高 |
| hideOkButton | `boolean` | ❌ | 隐藏ok按钮 |
| hideCancelButton | `boolean` | ❌ | 隐藏cancel按钮 |
| okButtonProps | `ButtonProps & {` | ❌ | 确定按钮 props |
| disabled | `boolean` | ❌ | - |
| cancelButtonProps | `ButtonProps & {` | ❌ | 取消按钮 props |
| disabled | `boolean` | ❌ | - |

## 完整 API 文档

详见 [在线文档](http://console-ops.page.ucloudadmin.com/pro-components/components/modal-form)

## 注意事项

- 安装需使用内部 npm registry: `--registry=http://registry.npm.pre.ucloudadmin.com`
- 可在任意 React 项目中使用（不依赖控制台环境）

---
*source: auto-sync from console-ops/pro-components*
