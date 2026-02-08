# AlertError

> UDesign Pro 组件

## 引入

```tsx
// 从主包引入
import { AlertError } from '@ucloud/pro-components';
// 或从子包引入（推荐，减少打包体积）
import { AlertError } from '@ucloud/pro-alert-error';
```

## Props

*Props 信息待补充*

## 用法示例

```jsx
import React from 'react';
import { AlertError } from '@ucloud/pro-alert-error';

export default () => (
  <AlertError message="alert error" reload={() => console.log('reload')} />
);
```

## 完整 API 文档

详见 [在线文档](http://console-ops.page.ucloudadmin.com/pro-components/components/alert-error)

## 注意事项

- 安装需使用内部 npm registry: `--registry=http://registry.npm.pre.ucloudadmin.com`
- 可在任意 React 项目中使用（不依赖控制台环境）

---
*source: auto-sync from console-ops/pro-components*
