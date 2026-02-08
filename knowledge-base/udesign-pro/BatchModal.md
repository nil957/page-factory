# BatchModal

> UDesign Pro 组件

## 引入

```tsx
// 从主包引入
import { BatchModal } from '@ucloud/pro-components';
// 或从子包引入（推荐，减少打包体积）
import { BatchModal } from '@ucloud/pro-batch-modal';
```

## Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| styleType | `string` | ❌ | - |
| totalCount | `number,` | ✅ | - |
| successCount | `number,` | ✅ | - |
| failCount | `number,` | ✅ | - |
| before | `TopNoticeShapeType` | ✅ | 开始前的确认提示，如果传入函数，第一个参数为totalCount（总数），第二个参数为successCount（成功数量），第三个参数为failCount（失败数量） |
| inProgress | `TopNoticeShapeType` | ✅ | 进行中的提示，如果传入函数，第一个参数为totalCount（总数），第二个参数为successCount（成功数量），第三个参数为failCount（失败数量） |
| finish | `TopNoticeShapeType` | ✅ | 完成后的提示，如果传入函数，第一个参数为totalCount（总数），第二个参数为successCount（成功数量），第三个参数为failCount（失败数量） |
| dataSource | `T[]` | ✅ | - |
| columns | `object[] | ((phase: 0 | 1 | 2) => object[])` | ✅ | - |
| rowKey | `string | (() => string)` | ✅ | - |
| pagination | `null` | ✅ | - |
| showHeader | `boolean` | ✅ | - |
| scroll | `{ x?: boolean | number | string; y?: boolean | number | string }` | ✅ | - |
| phase | `0 | 1 | 2` | ❌ | - |
| children | `React.ReactNode` | ❌ | - |
| dataSource | `T[]` | ✅ | 数据源，非受控 |
| columns | `object[] | ((phase: 0 | 1 | 2) => object[])` | ✅ | 表列信息，参考Table组件 类型是数组或者自定义函数 @argument {number} phase - 执行阶段，0 - 开始前，1 - 操作中，2 - 操作完成 |
| showHeader | `boolean` | ❌ | 是否显示表头 |
| showCloseIcon | `boolean` | ❌ | 是否一直显示右上角的关闭 icon |
| isSingle | `boolean` | ❌ | 是否为一次性批量请求 |
| autoRun | `boolean` | ❌ | 如果为true，则直接进入进行中状态，默认为false |
| rowKey | `string | (() => string)` | ✅ | 定义如何获取每行的键值(dataSource 子项中的某个属性)(用于 Table 中的 rowKey) |
| notice | `TopNoticeProps` | ❌ | 弹窗顶部的提示信息 |
| title | `string | React.ReactNode` | ✅ | 弹窗头部标题 |
| size | `'sm' | 'md' | 'lg'` | ❌ | 弹窗尺寸 枚举类型，有 sm、md、lg，默认值是 md |
| visible | `boolean` | ✅ | 显示与否 |
| confirmText | `string | React.ReactNode` | ❌ | 开始前的确认文本 |
| confirmTextTip | `string | React.ReactNode` | ❌ | 未勾选开始前的确认文本时，显示在确认按钮上的Tooltip |
| handler | `(record: T | T[], helper: HelperProps) => void` | ✅ | 批量操作处理函数 @argument {Object | Array} record - 行数据record或dataSource（isSingle === true） @argument {Object} helper - 控制展示状态的帮助对象，包含： 1. helper.process(text) - 更新状态为进行中，接收参数text:string用于展示状态列文案； 2. helper.success(text) - 更新状态为成功，接收参数text:string用于展示状态列文案； 3. helper.error(text,errMsg) - 更新状态为成功，接收第一个参数text:string用于展示状态列文案，第二个参数errMsg:string用于展示报错信息 |
| phase | `0 | 1 | 2,` | ✅ | - |
| defaultProps | `BatchTableProps<T>,` | ✅ | - |
| okBtnStyle | `'button' | 'slider'` | ❌ | 确认按钮样式，默认为button |
| okBtnText | `string` | ❌ | 自定义确认按钮的文案 |
| modalWrapperRender | `ModalWrapperRender` | ❌ | 渲染弹窗内容区的包裹，可用于发送一些前置请求，处理全局loading或全局报错 |
| isShowBeforeState | `boolean` | ❌ | 开始前是否展示状态列 |
| style | `React.CSSProperties` | ❌ | 自定义Modal样式 |

## 完整 API 文档

详见 [在线文档](http://console-ops.page.ucloudadmin.com/pro-components/components/batch-modal)

## 注意事项

- 安装需使用内部 npm registry: `--registry=http://registry.npm.pre.ucloudadmin.com`
- 可在任意 React 项目中使用（不依赖控制台环境）

---
*source: auto-sync from console-ops/pro-components*
