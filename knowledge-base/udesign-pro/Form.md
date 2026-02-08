# Form

> UDesign Pro 组件

## 引入

```tsx
// 从主包引入
import { Form } from '@ucloud/pro-components';
// 或从子包引入（推荐，减少打包体积）
import { Form } from '@ucloud/pro-form';
```

## Props

*Props 信息待补充*

## 用法示例

```tsx | pure
// 设置整体默认值
<ProForm initialValues={obj} />


// 设置单个控件的
<ProForm
 onChange={
    (data, item) => {
   // data 是当前表单的值
   // item 是当前表单的配置
   console.log(data, item)
 }}
>
  <ProFormText initialValue="prop"/>
</ProForm>

```

## 完整 API 文档

详见 [在线文档](http://console-ops.page.ucloudadmin.com/pro-components/components/form)

## 注意事项

- 安装需使用内部 npm registry: `--registry=http://registry.npm.pre.ucloudadmin.com`
- 可在任意 React 项目中使用（不依赖控制台环境）

---
*source: auto-sync from console-ops/pro-components*
