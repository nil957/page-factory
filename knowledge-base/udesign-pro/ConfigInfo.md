# ConfigInfo

> UDesign Pro 组件

## 引入

```tsx
// 从主包引入
import { ConfigInfo } from '@ucloud/pro-components';
// 或从子包引入（推荐，减少打包体积）
import { ConfigInfo } from '@ucloud/pro-config-info';
```

## Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | `React.ReactNode` | ❌ | 配置项标题 |
| styleType | `'horizontal' | 'vertical'` | ❌ | @description 排版类型: horizontal | vertical @default "vertical" |
| titleTip | `React.ReactNode` | ❌ | 配置项标题的解释内容 |
| content | `React.ReactNode` | ❌ | 配置项的内容 |
| extra | `React.ReactNode` | ❌ | 配置项的其他信息，如操作、补充信息等 |
| customTitleWidth | `number | string` | ❌ | 自定义标题的宽度 |
| isCovering | `boolean` | ❌ | 是否补位 |
| parentHeight | `number` | ❌ | 父级容器对象 |
| getItemHeight | `(height: number) => void` | ❌ | 子宽度的回调 |
| styleType | `'horizontal' | 'vertical'` | ❌ | 排版类型: 横向｜纵向, 默认为横向 |
| dataSource | `ItemType[]` | ✅ | 配置项数据数组 |
| col | `1 | 2 | 3 | 4` | ❌ | 多列展示的列数 |
| customTitleWidth | `number | string` | ❌ | 自定义标题的宽度，字符串要带"px"，如100或100px |
| className | `string` | ❌ | @ignore |
| icon | `React.ReactNode` | ❌ | 图标 |
| onClick | `(e: React.MouseEvent) => void` | ❌ | 点击时的回调 |
| popup | `React.ReactNode` | ❌ | 弹出层内容 |
| disabled | `boolean` | ❌ | 是否禁用，如果为true，则不响应onClick |
| styleType | `'primary' | 'secondary'` | ❌ | 样式类型 |
| children | `React.ReactNode` | ❌ | @ignore |

## 用法示例

```jsx
import { ProConfigInfo } from '@ucloud/pro-config-info';
import React from 'react';

export default () => (
  <ProConfigInfo
    dataSource={[
      { title: '资源ID', content: 'uhost-mjpncd1t' },
      { title: '可用区', titleTip: '解释文本', content: '北京二可用区B' },
    ]}
    col={3}
  />
);
```

```jsx
import { ProConfigInfo } from '@ucloud/pro-config-info';
import React from 'react';

export default () => (
  <ProConfigInfo
    dataSource={[
      { title: '资源ID', content: 'uhost-mjpncd1t' },
      { title: '可用区', titleTip: '解释文本', content: '北京二可用区B' },
      { title: '资源ID', content: 'uhost-mjpncd1t' },
      {
        title: '可用区',
        titleTip: '解释文本',
        content: '北京二可用区B',
        extra: <ProConfigInfo.ActionIcon disabled popup="点击修改" />,
      },
    ]}
    col={3}
  />
);
```

```jsx
import { ProConfigInfo } from '@ucloud/pro-config-info';
import React from 'react';

export default () => (
  <ProConfigInfo
    dataSource={[
      { content: 'uhost-mjpncd1t', extra: '2020-01-24' },
      { content: 'uhost-mjpncd1t', extra: '2020-01-24' },
    ]}
  />
);
```

## 完整 API 文档

详见 [在线文档](http://console-ops.page.ucloudadmin.com/pro-components/components/config-info)

## 注意事项

- 安装需使用内部 npm registry: `--registry=http://registry.npm.pre.ucloudadmin.com`
- 可在任意 React 项目中使用（不依赖控制台环境）

---
*source: auto-sync from console-ops/pro-components*
