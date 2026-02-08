# ExportCSV

> Console 业务组件 — **仅可在控制台项目中使用**

用于导出并下载 csv 文件。

## 引入

```jsx
import { ExportCSV } from 'common-components';
```

## Props

*Props 信息待补充*

## 用法示例

> 注意：示例中的 `CommonComponents` 是文档环境变量，实际使用时直接 import

```jsx
() => {
    const { useState } = React;
    const { Button, Icon } = Components;
    const { ExportCSV } = CommonComponents;

    const dataSource = [
        {
            UHostId: 'uhost-xi2cjaul',
            Zone: 'cn-bj2-02',
            LifeCycle: 'Normal',
            OsName: 'CentOS 8.2 64位',
            ImageId: 'bsi-wnthxnxt',
            BasicImageId: 'uimage-x3wyyb',
            BasicImageName: 'CentOS 8.2 64位',
            Tag: 'Default',
            Name: 'UHost',
            Remark: '',
            State: 'Running',
            NetworkState: 'Connected',
            HostType: 'N3',
            StorageType: 'UDisk',
            TotalDiskSpace: 0,
            DiskSet: [
                {
                    DiskId: 'bsi-wnthxnxt',
                    Drive: 'vda',
                    Size: 20,
                    Encrypted: 'false',
                    IsBoot: 'True',
                    DiskType: 'CLOUD_SSD',
                    Name: '系统盘_UHost',
                    Type: 'Boot'
                }
            ],
            NetCapability: 'Normal',
            IPSet: [
                {
                    Type: 'Private',
                    IPMode: 'IPv4',
                    IP: '10.42.0.150',
                    Mac: '52:54:00:D6:DC:26',
                    VPCId: 'uvnet-fuoflc2v',
                    SubnetId: 'subnet-fhrg1ddw',
                    Default: 'true'
                },
                { IPId: 'eip-ehsd4dl2', Bandwidth: 1, Type: 'BGP', Weight: 50, IP: '106.75.35.214', IPMode: 'IPv4' }
            ],
            SubnetType: 'Default',
            IsolationGroup: '',
            ChargeType: 'Month',
            ExpireTime: 1609430400,
            AutoRenew: 'Yes',
            IsExpire: 'No',
            UHostType: 'N3',
            OsType: 'Linux',
            RdmaClusterId: '',
            CpuPlatform: 'Intel/Skylake',
            CreateTime: 1607510274,
            CPU: 1,
            GPU: 0,
            Memory: 1024,
            TimemachineFeature: 'no',
            HotplugFeature: false,
            IPv6Feature: false,
            EncryptedDiskFeature: true,
            NetCapFeature: true,
            MachineType: 'N',
            BootDiskState: 'Normal',
            CloudInitFeature: true,
            'UHostIds.0': 'uhost-xi2cjaul',
            firewallUpdateFlag: true,
            VPCId: 'uvnet-fuoflc2v',
            SubnetId: 'subnet-fhrg1ddw',
            eips: [{ EIPId: 'eip-ehsd4dl2', Bandwidth: 1, ips: [null] }],
            DiskSpace: 0
        },
        {
            UHostId: 'uhost-nviohq2v',
            Zone: 'cn-bj2-02',
            LifeCycle: 'Normal',
            OsName: 'CentOS 8.2 64位',
            ImageId: 'bsi-blwehalt',
            BasicImageId: 'uimage-x3wyyb',
            BasicImageName: 'CentOS 8.2 64位',
            Tag: 'Default',
            Name: 'UHost',
            Remark: '',
            State: 'Running',
            NetworkState: 'Connected',
            HostType: 'N3',
            StorageType: 'UDisk',
            TotalDiskSpace: 0,
            DiskSet: [
                {
                    DiskId: 'bsi-blwehalt',
                    Drive: 'vda',
                    Size: 20,
                    Encrypted: 'false',
                    IsBoot: 'True',
                    DiskType: 'CLOUD_SSD',
                    Name: '系统盘_UHost',
                    Type: 'Boot'
                }
            ],
            NetCapability: 'Normal',
            IPSet: [
                {
                    Type: 'Private',
                    IPMode: 'IPv4',
                    IP: '10.42.0.132',
                    Mac: '52:54:00:E0:83:28',
                    VPCId: 'uvnet-fuoflc2v',
                    SubnetId: 'subnet-fhrg1ddw',
                    Default: 'true'
                },
                { IPId: 'eip-kqjl5aqc', Bandwidth: 1, Type: 'BGP', Weight: 50, IP: '117.50.35.110', IPMode: 'IPv4' }
            ],
            SubnetType: 'Default',
            IsolationGroup: '',
            ChargeType: 'Month',
            ExpireTime: 1609430400,
            AutoRenew: 'Yes',
            IsExpire: 'No',
            UHostType: 'N3',
            OsType: 'Linux',
            RdmaClusterId: '',
            CpuPlatform: 'Intel/Skylake',
            CreateTime: 1607508870,
            CPU: 1,
            GPU: 0,
            Memory: 1024,
            TimemachineFeature: 'no',
            HotplugFeature: false,
            IPv6Feature: false,
            EncryptedDiskFeature: true,
            NetCapFeature: true,
            MachineType: 'N',
            BootDiskState: 'Normal',
            CloudInitFeature: true,
            'UHostIds.0': 'uhost-nviohq2v',
            firewallUpdateFlag: true,
            VPCId: 'uvnet-fuoflc2v',
            SubnetId: 'subnet-fhrg1ddw',
            eips: [{ EIPId: 'eip-kqjl5aqc', Bandwidth: 1, ips: [null] }],
            DiskSpace: 0
        }
    ];

    const fields = [
        {
            label: '主机名称',
            value: 'Name'
        },
        {
            label: '资源ID',
            value: 'UHostId'
        },
        {
            label: '不存在的列',
            value: 'NotExist',
            default: 'NULL' // 默认显示的值
        },
        {
            label: '组合列',
            value: row => `CPU：${row['CPU']}核，内存：${row['Memory'] / 1024}G`
        }
    ];

    const filename = 'csvFile';

    const clickHandler = () => {
        ExportCSV.exportCSV({
            dataSource,
            fields,
            filename
        });
    };

    return (
        <Button styleType="primary" onClick={clickHandler}>
            下载CSV
        </Button>
    );
};
```

## 注意事项

- ⚠️ **仅限控制台项目** — 依赖控制台框架的 services、登录态、地域等能力
- 在 `.console/dependences.js` 中添加 `'common-components'` 进行引入
- 不可在独立 React 项目或 Sandpack 预览中使用

---
*source: auto-sync from console/common-components*
