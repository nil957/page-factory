# TextEllipsis

> UDesign Pro 组件

## 引入

```tsx
// 从主包引入
import { TextEllipsis } from '@ucloud/pro-components';
// 或从子包引入（推荐，减少打包体积）
import { TextEllipsis } from '@ucloud/pro-text-ellipsis';
```

## Props

*Props 信息待补充*

## 用法示例

```jsx
import { TextEllipsis } from '@ucloud/pro-text-ellipsis';
import React from 'react';

const { LineEllipsis } = TextEllipsis;

export default () => (
  <div>
    <div>
      <h3>基本</h3>
      <TextEllipsis
        text="UCloud （优刻得科技股份有限公司）是中立、安全的云计算服务平台，坚持中立，不涉足客户业务领域。公司自主研发IaaS、PaaS、大数据流通平台、AI服务平台等一系列云计算产品，并深入了解互联网、传统企业在不同场景下的业务需求，提供公有云、私有云、混合云、专有云在内的综合性行业解决方案。"
        maxLength={30}
      />
    </div>
    <div>
      <h3>截断方向可选择从前或从后</h3>
      <TextEllipsis
        text="UCloud （优刻得科技股份有限公司）是中立、安全的云计算服务平台，坚持中立，不涉足客户业务领域。公司自主研发IaaS、PaaS、大数据流通平台、AI服务平台等一系列云计算产品，并深入了解互联网、传统企业在不同场景下的业务需求，提供公有云、私有云、混合云、专有云在内的综合性行业解决方案。"
        maxLength={30}
        direction="fromEnd"
      />
    </div>
    <div>
      <h3>超过字符数量限制后默认出 tip，未超过限制不出 tip</h3>
      <TextEllipsis text="用于构建用户界面的 JavaScript 库" maxLength={30} />
    </div>
    <div>
      <h3>自定义省略号字符</h3>
      <TextEllipsis
        text="UCloud （优刻得科技股份有限公司）是中立、安全的云计算服务平台，坚持中立，不涉足客户业务领域。公司自主研发IaaS、PaaS、大数据流通平台、AI服务平台等一系列云计算产品，并深入了解互联网、传统企业在不同场景下的业务需求，提供公有云、私有云、混合云、专有云在内的综合性行业解决方案。"
        maxLength={30}
        ellipsis="~~~"
      />
    </div>
    <div>
      <h3>basedOn 截断基准，如果不设置，则根据字符自动判断</h3>
      <TextEllipsis
        text="React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes."
        maxLength={10}
      />
      <TextEllipsis
        text="React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes."
        maxLength={10}
        direction="fromEnd"
      />
    </div>
    <div>
      <h3>LineEllipsis</h3>
      <LineEllipsis text="UCloud （优刻得科技股份有限公司）是中立、安全的云计算服务平台，坚持中立，不涉足客户业务领域。公司自主研发IaaS、PaaS、大数据流通平台、AI服务平台等一系列云计算产品，并深入了解互联网、传统企业在不同场景下的业务需求，提供公有云、私有云、混合云、专有云在内的综合性行业解决方案。" />
      <LineEllipsis
        text="UCloud （优刻得科技股份有限公司）是中立、安全的云计算服务平台，坚持中立，不涉足客户业务领域。公司自主研发IaaS、PaaS、大数据流通平台、AI服务平台等一系列云计算产品，并深入了解互联网、传统企业在不同场景下的业务需求，提供公有云、私有云、混合云、专有云在内的综合性行业解决方案。"
        style={{ width: 400 }}
      />
    </div>
  </div>
);
```

## 完整 API 文档

详见 [在线文档](http://console-ops.page.ucloudadmin.com/pro-components/components/text-ellipsis)

## 注意事项

- 安装需使用内部 npm registry: `--registry=http://registry.npm.pre.ucloudadmin.com`
- 可在任意 React 项目中使用（不依赖控制台环境）

---
*source: auto-sync from console-ops/pro-components*
