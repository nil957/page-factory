# DateTime

> UDesign Pro 组件

## 引入

```tsx
// 从主包引入
import { DateTime } from '@ucloud/pro-components';
// 或从子包引入（推荐，减少打包体积）
import { DateTime } from '@ucloud/pro-date-time';
```

## Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| timestamp | `number | string` | ✅ | 时间戳（毫秒） |
| unit | `'ms' | 's'` | ❌ | @description 单位，'ms' | 's' @default "ms" |
| showTime | `boolean` | ❌ | 是否展示时间部分 |
| className | `string` | ❌ | @ignore |

## 完整 API 文档

详见 [在线文档](http://console-ops.page.ucloudadmin.com/pro-components/components/date-time)

## 注意事项

- 安装需使用内部 npm registry: `--registry=http://registry.npm.pre.ucloudadmin.com`
- 可在任意 React 项目中使用（不依赖控制台环境）

---
*source: auto-sync from console-ops/pro-components*
