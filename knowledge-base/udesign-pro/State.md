# State

> UDesign Pro 组件

## 引入

```tsx
// 从主包引入
import { State } from '@ucloud/pro-components';
// 或从子包引入（推荐，减少打包体积）
import { State } from '@ucloud/pro-state';
```

## Props

*Props 信息待补充*

## 用法示例

```jsx
import { State } from '@ucloud/pro-state';
import React from 'react';

export default () => (
  <div style={{ display: 'flex', gap: 8 }}>
    <div>
      <State type="success">运行中</State>
    </div>
    <div>
      <State type="stopped">停止</State>
    </div>
    <div>
      <State type="processing">执行中</State>
    </div>
    <div>
      <State type="loading">加载中</State>
    </div>
    <div>
      <State type="warning">警告</State>
    </div>
    <div>
      <State type="error">报错</State>
    </div>
  </div>
);
```

```jsx
import { State } from '@ucloud/pro-state';
import React from 'react';

export default () => (
  <div style={{ display: 'flex', gap: 8 }}>
    <div>
      <State type="success" componentType="tag">
        运行中
      </State>
    </div>
    <div>
      <State type="stopped" componentType="tag">
        停止
      </State>
    </div>
    <div>
      <State type="processing" componentType="tag">
        执行中
      </State>
    </div>
    <div>
      <State type="loading" componentType="tag">
        加载中
      </State>
    </div>
    <div>
      <State type="warning" componentType="tag">
        警告
      </State>
    </div>
    <div>
      <State type="error" componentType="tag">
        报错
      </State>
    </div>
  </div>
);
```

## 完整 API 文档

详见 [在线文档](http://console-ops.page.ucloudadmin.com/pro-components/components/state)

## 注意事项

- 安装需使用内部 npm registry: `--registry=http://registry.npm.pre.ucloudadmin.com`
- 可在任意 React 项目中使用（不依赖控制台环境）

---
*source: auto-sync from console-ops/pro-components*
