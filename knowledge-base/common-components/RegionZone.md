# RegionZone

> Console 业务组件 — **仅可在控制台项目中使用**

地区/可用区组件，用于处理地区可用区的公共逻辑处理。

## 引入

```jsx
import { RegionZone } from 'common-components';
```

## Props

| 属性 | 类型 | 说明 |
|------|------|------|
| size | oneOf | - |
| defaultValue | objectOf | - |
| value | objectOf | - |
| onChange | func | - |
| BitKey | string | - |
| showZone | bool | - |
| ProductCode | string | - |
| regionZoneStatus | arrayOf | - |
| readOnly | oneOfType | - |
| showRandomZone | bool | - |

## 用法示例

> 注意：示例中的 `CommonComponents` 是文档环境变量，实际使用时直接 import

```jsx
() => {
    const { useState } = React;
    const { RegionZone } = CommonComponents;

    const defaultValue = {
        Region: 'cn-sh2',
        Zone: 'cn-sh2-01'
    };

    const handleRegionChange = val => {
        console.log(val, '测试');
    };

    // BitKey: 'UIOT'  'CUBE'  'ULB'
    return (
        <div>
            <RegionZone BitKey="CUBE" defaultValue={defaultValue} onChange={handleRegionChange} />
        </div>
    );
};
```

```jsx
() => {
    const { useState } = React;
    const { RegionZone } = CommonComponents;

    const defaultValue = {
        Region: 'cn-sh2',
        Zone: 'cn-sh2-01'
    };

    const handleRegionChange = val => {
        console.log(val, '测试');
    };
    // BitKey: 'UIOT'  'CUBE'  'ULB'
    return (
        <div>
            <RegionZone
                BitKey="ULB"
                // ProductCode=""
                // showZone={false}
                defaultValue={defaultValue}
                onChange={handleRegionChange}
            />
        </div>
    );
};
```

```jsx
() => {
    const { useState } = React;
    const { RegionZone } = CommonComponents;

    const [zones, setZones] = useState([]);

    const defaultValue = {
        Region: 'cn-bj2',
        Zone: 'cn-bj2-04'
    };

    const regionZoneStatus = [
        {
            // disabled: true,
            tooltip: { popup: '禁用原因' },
            value: 'cn-bj2',
            defaultZone: 'cn-bj2-04'
        },
        {
            value: 'cn-sh2',
            bubble: { bubble: '8折', styleType: 'orange' },
            defaultZone: 'cn-sh2-08'
        },
        {
            value: 'cn-gd'
            // disabled: true
        },
        {
            value: 'hk'
            // disabled: true
        },
        {
            value: 'sg',
            disabled: true,
            bubble: { bubble: '售罄', styleType: 'gray' }
        }
    ];

    const handleRegionChange = val => {
        console.log(val, 'demo测试');
        const { Zones } = val;
        if (Zones) {
            setZones(Zones);
        }
    };

    return (
        <div>
            <RegionZone
                // showZone={false}
                BitKey="UHOST"
                ProductCode="uhost"
                defaultValue={defaultValue}
                regionZoneStatus={regionZoneStatus}
                onChange={handleRegionChange}
            />
        </div>
    );
};
```

## 注意事项

- ⚠️ **仅限控制台项目** — 依赖控制台框架的 services、登录态、地域等能力
- 在 `.console/dependences.js` 中添加 `'common-components'` 进行引入
- 不可在独立 React 项目或 Sandpack 预览中使用

---
*source: auto-sync from console/common-components*
