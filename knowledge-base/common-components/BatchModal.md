# BatchModal

> Console 业务组件 — **仅可在控制台项目中使用**

批量操作弹窗，用于控制台各类批量操作场景。

## 引入

```jsx
import { BatchModal } from 'common-components';
```

## Props

*Props 信息待补充*

## 用法示例

> 注意：示例中的 `CommonComponents` 是文档环境变量，实际使用时直接 import

```jsx
() => {
    const { useState } = React;
    const { Modal, Button, Switch, Form, Radio, Box } = Components;
    const { BatchModal } = CommonComponents;

    const [autoRun, setAutoRun] = useState(false);
    const [demoError, setDemoError] = useState(false);
    const [demoConfirm, setDemoConfirm] = useState(false);
    const [demoShowHeader, setDemoShowHeader] = useState(true);
    const [demoShowCloseIcon, setDemoShowCloseIcon] = useState(false);
    const [demoIsSingle, setDemoIsSingle] = useState(false);
    const [demoShowTableBottomRender, setDemoShowTableBottomRender] = useState(false);
    const [demoShowOkBtnSlider, setDemoShowOkBtnSlider] = useState(false);
    const [isRelated, setIsRelated] = useState(true);

    const itemLayout = {
        labelCol: {
            span: 3
        },
        controllerCol: {
            span: 9
        }
    };

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

    const columns = [
        {
            title: '资源ID',
            key: 'UHostId',
            dataIndex: 'UHostId'
        },
        {
            title: '已绑定EIP',
            key: 'IPSet',
            dataIndex: 'IPSet',
            render: value => value.map(v => <div>{v.IP}</div>)
        },
        {
            title: '已绑定云硬盘',
            key: 'DiskSet',
            dataIndex: 'DiskSet',
            render: value => value.map(v => <div>{`${v.DiskId}(${v.Drive})`}</div>)
        }
    ];

    const action1 = datas =>
        new Promise(resolve => {
            const result = demoIsSingle ? datas.map(data => data.UHostId) : datas.UHostId;

            setTimeout(() => {
                console.log('action1', datas);
                resolve(result);
            }, 2000);
        });

    const action2 = datas =>
        new Promise(resolve => {
            setTimeout(() => {
                console.log('action2', datas);
                resolve(datas);
            }, 1000);
        });

    const errorAction = datas =>
        new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('errorAction', datas);
                reject('报错信息');
            }, 2000);
        });

    const okHandler = async (record, helper, isConfirmed) => {
        console.log('是否选择二次确认条件 - isConfirmed', isConfirmed);
        helper.process('正在执行action1');
        action1(record).then(id => {
            if (demoError) {
                helper.process('正在执行错误action');
                errorAction(id).then(
                    () => {},
                    err => {
                        helper.error('执行失败', err);
                    }
                );
            } else {
                helper.process('正在执行action2');
                action2(id).then(() => helper.success('执行成功'));
            }
        });
        // const id = await action1(record);
        // helper.process('正在执行action2');
        // await action2(id);
        // helper.success('执行成功');
    };

    const notice = {
        before(total, success, fail) {
            return `是否批量操作以下${total}条资源`;
        },
        inProgress(total, success, fail) {
            return `${total - success - fail}条资源批量操作中，其中${fail}条失败`;
        },
        finish(total, success, fail) {
            return `${total}条资源操作完成，其中${fail}条失败`;
        }
    };

    const tableBottomRender = () => {
        return (
            <BatchModal.ExtraInfoArea title="以下绑定的内容将一并永久删除">
                <Box container>
                    <BatchModal.ProductItem style={{ flex: 1 }} product="uhost" />
                    <BatchModal.ProductItem style={{ flex: 1 }} icon="unet" name="外网弹性 IP" />
                    <BatchModal.ProductItem style={{ flex: 1 }} icon="udisk" name="云盘" />
                    <BatchModal.ProductItem style={{ flex: 1 }} icon="snapshot" name="快照" />
                </Box>
            </BatchModal.ExtraInfoArea>
        );
    };

    let modalInstance = null;

    return (
        <Form>
            <Form.Item label="任务出错场景" {...itemLayout}>
                <Switch checked={demoError} onChange={setDemoError} />
            </Form.Item>
            <Form.Item label="autoRun" {...itemLayout}>
                <Switch checked={autoRun} onChange={setAutoRun} />
            </Form.Item>
            <Form.Item label="confirmText" {...itemLayout}>
                <Switch checked={demoConfirm} onChange={setDemoConfirm} />
            </Form.Item>
            <Form.Item label="showHeader" {...itemLayout}>
                <Switch checked={demoShowHeader} onChange={setDemoShowHeader} />
            </Form.Item>
            <Form.Item label="showCloseIcon" {...itemLayout}>
                <Switch checked={demoShowCloseIcon} onChange={setDemoShowCloseIcon} />
            </Form.Item>
            <Form.Item label="isSingle" {...itemLayout}>
                <Switch checked={demoIsSingle} onChange={setDemoIsSingle} />
            </Form.Item>
            <Form.Item label="tableBottomRender" {...itemLayout}>
                <Switch checked={demoShowTableBottomRender} onChange={setDemoShowTableBottomRender} />
            </Form.Item>
            <Form.Item label="okBtnStyle=slider" {...itemLayout}>
                <Switch checked={demoShowOkBtnSlider} onChange={setDemoShowOkBtnSlider} />
            </Form.Item>
            <Form.Item label="isRelated" {...itemLayout}>
                <Switch checked={isRelated} onChange={setIsRelated} />
            </Form.Item>
            <Button
                onClick={() => {
                    modalInstance = Modal.openModal(
                        <BatchModal
                            title="批量操作"
                            visible={true}
                            autoRun={autoRun}
                            onClose={isFinished => {
                                console.log('isFinished', isFinished);
                                modalInstance && modalInstance.destroy();
                            }}
                            handler={okHandler}
                            dataSource={dataSource}
                            columns={columns}
                            rowKey="UHostId"
                            confirmText={demoConfirm ? '开始前的确认提示' : ''}
                            notice={notice}
                            isSingle={demoIsSingle}
                            showHeader={demoShowHeader}
                            showCloseIcon={demoShowCloseIcon}
                            tableBottomRender={demoShowTableBottomRender ? tableBottomRender : null}
                            okBtnStyle={demoShowOkBtnSlider ? 'slider' : 'button'}
                            okBtnText={demoShowOkBtnSlider ? '向右拖动滑块，确认删除' : undefined}
                            confirmTextTip={demoShowOkBtnSlider && demoConfirm ? '请确认已阅读操作须知。' : undefined}
                            isRelated={isRelated}
                        />
                    );
                }}
            >
                批量操作
            </Button>
        </Form>
    );
};
```

```jsx
() => {
    const ROW_KEY = 'UHostId';
    const initialState = [];

    const { useState, useRef, useEffect, useReducer } = React;
    const { Table, Button, Modal } = Components;
    const { BatchModal } = CommonComponents;

    const [selectRowKeys, setSelectRowKeys] = useState([]);
    const modalRef = useRef(null);
    const [dataSource, dataDispatch] = useReducer(reducer, initialState, initDataSource);

    // 更新 dataSource 最好使用 useReducer, 避免拿到旧的数据，导致部分更新
    function reducer(state, action) {
        switch (action.type) {
            case 'update-status':
                const { record, status } = action;
                const _data = state.map(item => {
                    if (item[ROW_KEY] === record[ROW_KEY]) {
                        return {
                            ...item,
                            Status: status
                        };
                    } else {
                        return item;
                    }
                });
                return _data;
            default:
                return state;
        }
    }

    const columns = [
        {
            title: '资源ID',
            key: 'UHostId',
            dataIndex: 'UHostId'
        },
        {
            title: '已绑定EIP',
            key: 'IPSet',
            dataIndex: 'IPSet',
            render: value => value.map(v => <div>{v.IP}</div>)
        },
        {
            title: '已绑定云硬盘',
            key: 'DiskSet',
            dataIndex: 'DiskSet',
            render: value => value.map(v => <div>{`${v.DiskId}(${v.Drive})`}</div>)
        },
        {
            title: '状态',
            key: 'Status',
            dataIndex: 'Status'
        }
    ];

    function initDataSource() {
        const _data = [
            {
                UHostId: 'uhost-xi2cjaul',
                Status: '运行中',
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
                ]
            },
            {
                UHostId: 'uhost-nviohq2v',
                Status: '运行中',
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
                ]
            }
        ];

        return _data;
    }

    const action1 = datas =>
        new Promise(resolve => {
            const result = datas.UHostId;
            setTimeout(() => {
                console.log('action1', datas);
                resolve(result);
            }, 2000);
        });

    const action2 = datas =>
        new Promise(resolve => {
            setTimeout(() => {
                console.log('action2', datas);
                resolve(datas);
            }, 1000);
        });
    const errorAction = datas =>
        new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('errorAction', datas);
                reject('报错信息');
            }, 2000);
        });

    const okHandler = async (record, helper) => {
        helper.process('正在执行action1');
        dataDispatch({ type: 'update-status', record, status: '删除中...' });

        action1(record).then(id => {
            // 执行失败
            helper.process('正在执行错误action');
            errorAction(id).then(
                () => {},
                err => {
                    dataDispatch({ type: 'update-status', record, status: '删除失败' });
                    helper.error('执行失败', err);
                }
            );

            // 执行成功
            // helper.process('正在执行action2');
            // action2(id).then(() => {
            //     dataDispatch({ type: 'update-status', record, status: '删除成功' });
            //     helper.success('删除成功');
            // });
        });
    };

    function handleDelete() {
        const modalDataSource = dataSource.filter(dataItem => {
            // UHostId 为 dataSource 的 rowKey
            return selectRowKeys.findIndex(key => key === dataItem.UHostId) >= 0;
        });
        const notice = {
            before(total, success, fail) {
                return `是否批量操作以下${total}条资源`;
            },
            inProgress(total, success, fail) {
                return `${total - success - fail}条资源批量操作中，其中${fail}条失败`;
            },
            finish(total, success, fail) {
                return `${total}条资源操作完成，其中${fail}条失败`;
            }
        };

        modalRef.current = Modal.openModal(
            <BatchModal
                visible
                title="批量删除"
                dataSource={modalDataSource}
                columns={columns}
                rowKey="UHostId"
                showCloseIcon
                onClose={onClose}
                handler={okHandler}
                notice={notice}
            />
        );
    }

    function onClose() {
        if (!modalRef.current) return;
        modalRef.current.destroy();
    }

    return (
        <div>
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="UHostId"
                rowSelection={{
                    defaultSelectedRowKeys: selectRowKeys,
                    onChange: keys => setSelectRowKeys(keys)
                }}
                title={() => (
                    <Button size="lg" onClick={handleDelete} disabled={!selectRowKeys.length}>
                        批量删除
                    </Button>
                )}
            />
        </div>
    );
};
```

```jsx
() => {
    const { useState } = React;
    const { Modal, Button, Switch, Form, Radio } = Components;
    const { BatchModal } = CommonComponents;

    const itemLayout = {
        labelCol: {
            span: 3
        },
        controllerCol: {
            span: 9
        }
    };

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

    const columns = [
        {
            title: '资源ID',
            key: 'UHostId',
            dataIndex: 'UHostId'
        },
        {
            title: '已绑定EIP',
            key: 'IPSet',
            dataIndex: 'IPSet',
            render: value => value.map(v => <div>{v.IP}</div>)
        },
        {
            title: '已绑定云硬盘',
            key: 'DiskSet',
            dataIndex: 'DiskSet',
            render: value => value.map(v => <div>{`${v.DiskId}(${v.Drive})`}</div>)
        }
    ];

    const action1 = datas =>
        new Promise(resolve => {
            const result = datas.UHostId;

            setTimeout(() => {
                console.log('action1', datas);
                resolve(result);
            }, 2000);
        });

    const action2 = datas =>
        new Promise(resolve => {
            setTimeout(() => {
                console.log('action2', datas);
                resolve(datas);
            }, 1000);
        });

    const okHandler = async (record, helper) => {
        helper.process('正在执行action1');
        action1(record).then(id => {
            helper.process('正在执行action2');
            action2(id).then(() => helper.success('执行成功'));
        });
    };

    const notice = {
        before: {
            content: (total, success, fail) => {
                return `是否批量操作以下${total}条资源，操作后无法恢复！`;
            },
            styleType: 'warning'
        },
        inProgress(total, success, fail) {
            return `${total - success - fail}条资源批量操作中，其中${fail}条失败`;
        },
        finish(total, success, fail) {
            return `${total}条资源操作完成，其中${fail}条失败`;
        }
    };

    let modalInstance = null;

    return (
        <Button
            onClick={() => {
                modalInstance = Modal.openModal(
                    <BatchModal
                        title="批量操作"
                        visible={true}
                        onClose={isFinished => {
                            console.log('isFinished', isFinished);
                            modalInstance && modalInstance.destroy();
                        }}
                        handler={okHandler}
                        dataSource={dataSource}
                        columns={columns}
                        rowKey="UHostId"
                        confirmText="开始前的确认提示"
                        notice={notice}
                    />
                );
            }}
        >
            批量操作
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
