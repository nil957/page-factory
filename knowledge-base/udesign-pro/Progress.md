# Progress

> UDesign Pro 组件

## 引入

```tsx
// 从主包引入
import { Progress } from '@ucloud/pro-components';
// 或从子包引入（推荐，减少打包体积）
import { Progress } from '@ucloud/pro-progress';
```

## Props

*Props 信息待补充*

## 用法示例

```jsx
import React from 'react';
import { ProProgress } from '@ucloud/pro-progress';

export default () => (
  <div>
    <ProProgress styleType="circle" percent={30} color="success" />
    <br />
    <ProProgress percent={30} color="success" />
  </div>
);
```

```jsx
import React from 'react';
import { ProProgress } from '@ucloud/pro-progress';

export default () => (
  <div>
    <ProProgress styleType="circle" percent={30} color="success" size="lg" />
    <br />
    <ProProgress percent={30} color="success" size="lg" />
  </div>
);
```

```jsx
import React from 'react';
import { ProProgress } from '@ucloud/pro-progress';

export default () => (
  <div style={{ fontSize: '12px' }}>
    <ProProgress
      styleType="circle"
      percent={30}
      color="success"
      size="lg"
      format={null}
    />
    <br />
    <ProProgress
      styleType="circle"
      percent={30}
      color="success"
      size="lg"
      format={(v) => `${v.toFixed(2)}%`}
    />
  </div>
);
```

## 完整 API 文档

详见 [在线文档](http://console-ops.page.ucloudadmin.com/pro-components/components/progress)

## 注意事项

- 安装需使用内部 npm registry: `--registry=http://registry.npm.pre.ucloudadmin.com`
- 可在任意 React 项目中使用（不依赖控制台环境）

---
*source: auto-sync from console-ops/pro-components*
