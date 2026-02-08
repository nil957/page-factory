# Copy

> UDesign Pro 组件

## 引入

```tsx
// 从主包引入
import { Copy } from '@ucloud/pro-components';
// 或从子包引入（推荐，减少打包体积）
import { Copy } from '@ucloud/pro-copy';
```

## Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| copyTip | `string | React.ReactNode` | ✅ | 复制前的提示文案 |
| copiedTip | `string | React.ReactNode` | ✅ | 复制后的提示文案 |
| text | `string` | ✅ | 复制内容 |
| tipContent | `tipShape` | ❌ | 提示文案 |
| className | `string` | ❌ | 样式类名 |

## 用法示例

```jsx
import React from 'react';
import { Copy } from '@ucloud/pro-copy';

export default () => <Copy text="Hello UDesign!" />;
```

```jsx
import React from 'react';
import { Copy } from '@ucloud/pro-copy';

const Demo = () => {
  const [state, setState] = React.useState('Hello UDesign!');
  React.useEffect(() => {
    setTimeout(() => {
      setState('哈哈');
    }, 1000);
  }, []);
  return (
    <div>
      {state}
      <Copy text={state} />
    </div>
  );
};
export default () => <Demo />;
```

```jsx
import React from 'react';
import { Copy } from '@ucloud/pro-copy';

const Demo = () => {
  const copy = Copy.useCopy();
  return (
    <div>
      <button onClick={() => copy('Hello UDesign1234!')}>复制</button>
    </div>
  );
};
export default () => <Demo />;
```

## 完整 API 文档

详见 [在线文档](http://console-ops.page.ucloudadmin.com/pro-components/components/copy)

## 注意事项

- 安装需使用内部 npm registry: `--registry=http://registry.npm.pre.ucloudadmin.com`
- 可在任意 React 项目中使用（不依赖控制台环境）

---
*source: auto-sync from console-ops/pro-components*
