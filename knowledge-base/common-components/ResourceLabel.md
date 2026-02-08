# ResourceLabel

> Console 业务组件 — **仅可在控制台项目中使用**

控制台资源 Lable 展示组件。

## 引入

```jsx
import { ResourceLabel } from 'common-components';
```

## Props

*Props 信息待补充*

## 用法示例

> 注意：示例中的 `CommonComponents` 是文档环境变量，实际使用时直接 import

```jsx
() => {
    const { ResourceId, ResourceLabel } = CommonComponents;
    const { Table } = Components;
    const { enhanceWithLabels } = ResourceLabel;

    const TableWithLabels = React.useMemo(() => {
        return enhanceWithLabels(Table, {
            width: 210,
            ResourceIdDataIndex: 'UHostId',
            noPermission: record => {
                console.log('record', record);
                return false;
            }
        });
    }, []);
    const [title, setTitle] = React.useState('Name');
    const [dataSource, setDataSource] = React.useState([
        {
            Zone: 'cn-sh2-02',
            UHostId: 'uhost-1bvvgrdjdrkr',
            Tag: 'Default',
            Remark: '',
            Name: 'UHost'
        }
    ]);

    React.useEffect(() => {
        setTitle('UHostName');
        setTimeout(() => {
            setDataSource([
                {
                    Zone: 'cn-sh2-03',
                    UHostId: 'uhost-1cyif0108n8p',
                    Tag: 'Default',
                    Remark: '',
                    Name: 'UHost11'
                },
                {
                    Zone: 'cn-sh2-03',
                    UHostId: 'uhost-1bvvgrdjdrkr',
                    Tag: 'Default',
                    Remark: '',
                    Name: 'UHost11'
                }
            ]);
        }, 1000);
    }, []);
    return (
        <div>
            <TableWithLabels
                columns={[
                    {
                        title: 'Name1',
                        dataIndex: 'Name',
                        key: 'Name',
                        order: true,

                        render: (_, record) => {
                            return `${title}_${record.Name}`;
                        }
                    },
                    {
                        title: 'UHostId',
                        dataIndex: 'UHostId',
                        key: 'UHostId',
                        order: true
                    },
                    {
                        title: 'Tag',

                        dataIndex: 'Tag',
                        key: 'Tag',
                        width: 110
                    },
                    {
                        title: 'Zone',
                        dataIndex: 'Zone',
                        key: 'Zone',
                        width: 130
                    }
                ]}
                dataSource={dataSource}
                onConditionChange={props => {
                    console.log('onConditionChange', props);
                }}
            />
        </div>
    );
};
```

```jsx
() => {
    const { ResourceLabel } = CommonComponents;

    return (
        <div>
            <ResourceLabel.LabelsConfig resourceId="uhost-1bvvgrdjdrkr" />
        </div>
    );
};
```

```jsx
() => {
    const { ResourceId, ResourceLabel } = CommonComponents;
    const { useState } = React;
    const [labels, setLabels] = useState([
        {
            Key: 'Key1',
            Value: 'value1'
        },
        {
            Key: 'key很长key很长key很长key很长key很长key很长key很长key很长key很长',
            Value: 'value1'
        },
        {
            Key: 'key2',
            Value: 'value很长value很长value很长value很长value很长value很长value很长'
        },
        {
            Key: 'key很长key很长key很长key很长key很长key很长key很长key很长key很长',
            Value: 'value很长value很长value很长value很长value很长value很长value很长'
        }
    ]);
    return (
        <div>
            <ResourceLabel
                onChange={labels => {
                    console.log('onChange', labels);
                    setLabels(labels);
                }}
                value={labels}
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
