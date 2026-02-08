# DropDown

> UDesign Pro 组件

## 引入

```tsx
// 从主包引入
import { DropDown } from '@ucloud/pro-components';
// 或从子包引入（推荐，减少打包体积）
import { DropDown } from '@ucloud/pro-drop-down';
```

## Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| label | `React.ReactNode` | ✅ | - |
| key | `string` | ✅ | - |
| type | `'item' | 'subMenu'` | ✅ | - |
| subMenuKey | `string` | ❌ | - |
| styleType | `'collapse' | 'popover'` | ❌ | - |
| children | `MenuItemProps[]` | ❌ | - |
| popoverProps | `Omit<PopoverProps, 'popup' | 'animation' | 'trigger'>` | ❌ | 见基础组件 https://udesign.ucloud.cn/component/Popover/ |
| menuProps | `MenuProps` | ❌ | 见基础组件 https://udesign.ucloud.cn/component/Menu/ |
| key | `string` | ❌ | - |
| menuItems | `MenuItemProps[]` | ✅ | 见基础组件 https://udesign.ucloud.cn/component/Menu/#itemzh6amx0 |
| loading | `boolean` | ❌ | - |
| children | `React.ReactNode` | ❌ | - |

## 完整 API 文档

详见 [在线文档](http://console-ops.page.ucloudadmin.com/pro-components/components/drop-down)

## 注意事项

- 安装需使用内部 npm registry: `--registry=http://registry.npm.pre.ucloudadmin.com`
- 可在任意 React 项目中使用（不依赖控制台环境）

---
*source: auto-sync from console-ops/pro-components*
