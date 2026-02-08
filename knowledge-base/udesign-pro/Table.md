# Table

> UDesign Pro 组件

## 引入

```tsx
// 从主包引入
import { Table } from '@ucloud/pro-components';
// 或从子包引入（推荐，减少打包体积）
import { Table } from '@ucloud/pro-table';
```

## Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| label | `ReactNode` | ✅ | - |
| value | `string` | ✅ | - |
| data | `T[] | undefined` | ✅ | - |
| success | `boolean` | ❌ | - |
| total | `number` | ❌ | - |
| error | `string` | ❌ | - |
| isRequestAll | `boolean` | ❌ | 用于外部表示是否一次性请求列表全部数据, 为ture 会终止【页码】和【筛选】的请求 ， 但刷新会重新请求全部数据 |
| label | `ReactNode` | ❌ | 展示 |
| children | `ColActionInfo[]` | ❌ | 子菜单，仅 menu 项有效 |
| tooltip | `ReactNode | any` | ❌ | 提示内容，或自定义 tooltip props |
| disabled | `boolean` | ❌ | 禁用 |
| size | `Size` | ❌ | 尺寸，仅展示在外可用 |
| styleType | `ButtonProps['styleType']` | ❌ | 按钮的 styleType，仅展示在外可用 |
| onClick | `(record: any, e: React.MouseEvent<HTMLDivElement>) => void` | ❌ | 点击回调 |
| dataIndex | `string` | ✅ | record渲染所需字段 |
| search | `boolean` | ❌ | 开启搜索状态 默认渲染于工具栏处，增加字段切换 |
| exact | `boolean` | ❌ | 搜索方式类型 true为精确,false为模糊 |
| searchType | `'inset' | 'outset'` | ❌ | inset 模糊搜索工具栏处，增加字段切换 outset 创建搜索表单 |
| searchItemProps | `{` | ❌ | 配合 searchType = outset，设置表单组件参数 支持配置 ProFormInput ， ProFormSelect ， ProFormDatePicker ，ProFormDateRangePicker，ProFormRadioGroup，ProFormCheckboxGroup，ProFormSwitch，ProFormNumberInput |
| fieldProps | `Record<string, any>` | ❌ | - |
| ellipsis | `boolean` | ❌ | 没有自定义render的时候,页面table中文本会自动缩略 |
| tips | `{` | ❌ | 表头提示 |
| content | `ReactNode` | ✅ | - |
| icon | `ReactNode` | ❌ | - |
| stateProps | `{` | ❌ | state内置渲染,如果有render render的优先级更高 |
| style | `React.CSSProperties` | ❌ | - |
| componentType | `'badge' | 'tag'` | ❌ | - |
| tagProps | `Omit<TagProps, 'styleType'>` | ❌ | - |
| render | `(record: any) =>` | ✅ | - |
| type | `UStateType` | ✅ | - |
| content | `ReactNode` | ❌ | - |
| type | `UStateType` | ✅ | - |
| content | `ReactNode` | ✅ | - |
| dataTimeProps | `{` | ❌ | 时间戳内置渲染,如果有render render的优先级更高 |
| unit | `'ms' | 's'` | ✅ | - |
| showTime | `boolean` | ❌ | - |
| progressProps | `(record: any) => {` | ❌ | - |
| text | `ReactNode` | ❌ | - |
| styleType | `'line' | 'circle'` | ❌ | - |
| size | `'sm' | 'lg'` | ❌ | 进度条型号，可选值是 'sm' | 'lg'， 默认是 'sm' |
| style | `React.CSSProperties` | ❌ | style @ignore |
| className | `string` | ❌ | className @ignore |
| actionListProps | `(record: any) => Omit<` | ❌ | 操作按钮集合 |
| actionList | `ColActionInfo[]` | ✅ | - |
| copy | `{` | ❌ | 对文本进行复制 |
| show | `boolean` | ✅ | 是否展示 |
| tipContent | `tipShape` | ❌ | 自定义复制文本提示文案 |
| formatter | `(record: any) => string` | ❌ | 自定义复制文本,默认为列表数据 |
| onClick | `(record: any) => void` | ❌ | 自定义复制方法 |
| exportRender | `(col: any, row?: any) => string` | ❌ | 导出使用的render |
| minWidth | `number` | ❌ | 最小宽度 ，配合宽度拖拽使用 |
| maxWidth | `number` | ❌ | 最大宽度，配合宽度拖拽使用 |
| order | `Record<string, SortOrder>` | ✅ | - |
| filters | `Record<string, (string | number)[] | null>[]` | ✅ | - |
| searchValue | `string` | ✅ | - |
| limit | `number` | ❌ | 分页数量 |
| request | `(` | ✅ | 批量请求方法 |
| limit | `number,` | ✅ | - |
| offset | `number,` | ✅ | - |
| data | `any[]` | ✅ | - |
| total | `number` | ✅ | - |
| process | `(data: any[], total: number) => void` | ❌ | 批量请求进度回调 |
| success | `(finalResult: any[], total?: number) => void` | ❌ | 请求成功回调 |
| error | `(e: Error) => void` | ❌ | 请求失败回调 |
| reload | `(resetPageIndex?: boolean) => Promise<void>` | ✅ | 刷新 |
| pageInfo | `PageInfo` | ❌ | p页面的信息都在里面 |
| reloadAndRest | `() => Promise<void>` | ❌ | 刷新并清空，只清空页面，不包括表单 |
| reset | `() => void` | ❌ | 重置任何输入项，包括表单 |
| clearSelected | `() => void` | ❌ | 清空选择 |
| fullScreen | `() => void` | ❌ | - |
| setPageInfo | `(page: Partial<PageInfo>) => void` | ❌ | - |
| clearBatchQueue | `() => void` | ❌ | - |
| clearFilterAndSearch | `(flag: boolean) => void` | ❌ | - |
| toolbarRefresh | `() => void` | ❌ | - |
| pageSize | `number` | ✅ | - |
| total | `number` | ❌ | - |
| current | `number` | ✅ | - |
| isRequestAll | `boolean` | ✅ | - |
| dataSource | `T[]` | ✅ | - |
| defaultDataSource | `T[]` | ✅ | - |
| setDataSource | `(dataSource: T[]) => void` | ✅ | - |
| setTableLoading | `(loading: boolean) => void` | ✅ | - |
| loading | `boolean | undefined` | ✅ | - |
| pageInfo | `PageInfo` | ✅ | - |
| reload | `() => Promise<void>` | ✅ | - |
| fullScreen | `() => void` | ❌ | - |
| reset | `() => void` | ✅ | - |
| pollingLoading | `boolean` | ✅ | - |
| setPageInfo | `(pageInfo: Partial<PageInfo>) => void` | ✅ | - |
| requestError | `string` | ❌ | - |
| dataSource | `any` | ❌ | 数据源 @type {any} |
| batchLimit | `number` | ❌ | 批处理 @type {number} |
| loading | `UseFetchDataAction['loading']` | ✅ | 是否处于加载状态 @type {UseFetchDataAction['loading']} |
| onLoadingChange | `(loading: UseFetchDataAction['loading']) => void` | ❌ | 加载状态改变时的回调函数 @type {(loading: UseFetchDataAction['loading']) => void} |
| onLoad | `(dataSource: any[], extra: any) => void` | ❌ | 数据加载完成后的回调函数 @type {(dataSource: any[], extra: any) => void} |
| onDataSourceChange | `(dataSource?: any) => void` | ❌ | 数据源变化时的回调函数 @type {(dataSource?: any) => void} |
| postData | `(dataSource: any[]) => any[]` | ✅ | 请求时附带的数据 @type {any} |
| current | `number` | ❌ | - |
| pageSize | `number` | ❌ | - |
| defaultCurrent | `number` | ❌ | - |
| defaultPageSize | `number` | ❌ | - |
| propsPagination | `PaginationProps | null` | ❌ | - |
| onPageInfoChange | `(pageInfo: PageInfo) => void` | ❌ | 分页信息变化时的回调函数 @type {(pageInfo: PageInfo) => void} |
| effects | `{` | ❌ | 请求相关的副作用 @type {any[]} |
| params | `string` | ✅ | - |
| condition | `string` | ✅ | - |
| filterKeyWordsMap | `string` | ✅ | - |
| formMap | `string` | ✅ | - |
| onRequestError | `(e: Error) => void` | ❌ | 请求出错时的回调函数 @type {(e: Error) => void} |
| manual | `boolean` | ✅ | 是否手动触发请求 @type {boolean} |
| debounceTime | `number` | ❌ | 请求防抖时间 @type {number} |
| polling | `number | ((dataSource: any[]) => number)` | ❌ | 数据源轮询间隔时间或轮询触发条件 @type {number | ((dataSource: any[]) => number)} |
| revalidateOnFocus | `boolean` | ❌ | 是否在页面获得焦点时重新验证数据 @type {Boolean} |
| doNotHandleCondition | `boolean` | ❌ | 自行处理筛选等逻辑 @type {Boolean} |
| actionRef | `React.MutableRefObject<ActionType | undefined>` | ❌ | 操作 ref @type {React.MutableRefObject<ActionType | undefined>} |
| size | `Size` | ❌ | - |
| hideRefresh | `boolean` | ❌ | 刷新按钮 |
| clearCondition | `boolean` | ❌ | 刷新的时候是否清楚table内的搜索条件 |
| search | `boolean` | ❌ | 搜索按钮 |
| hideColumnConfig | `boolean` | ❌ | 隐藏表头配置弹窗按钮 |
| export | `{` | ❌ | 导出按钮 |
| show | `boolean` | ❌ | - |
| title | `string` | ❌ | - |
| icon | `ReactNode` | ❌ | - |
| downType | `'csv' | 'excel' | 'custom'` | ❌ | - |
| handleExport | `(` | ❌ | - |
| columns | `ProColumn[],` | ✅ | - |
| dataSource | `T[],` | ✅ | - |
| selectedRowKeys | `string[],` | ✅ | - |
| exportFn | `(data: any[], schema: ProColumn[], filename?: string) => void,` | ✅ | - |
| slot | `ReactNode` | ❌ | 操作插槽 |
| operate | `ReactNode` | ❌ | 操作按钮 |
| actionListProps | `DefinedActionListProps` | ❌ | 操作按钮集合 |
| onPreciseConditionChange | `(` | ❌ | 精确匹配的回调 ,formMap 高级表单的筛选 |
| condition | `TableConditionChangeEventOrder & {` | ✅ | - |
| searchKey | `string` | ✅ | - |
| filterMap | `Record<string, string>` | ✅ | - |
| formMap | `Record<string, any>` | ✅ | - |
| searchInputProps | `Record<string, any>` | ❌ | 拓展search input props |
| modalProps | `Record<string, any>` | ❌ | 拓展拓展ColumnConfigButton配置 |
| handlerRefresh | `() => void` | ❌ | 刷新的回调函数 |
| innerExtraSearchOptions | `searchOption[]` | ❌ | 额外的筛选条件，例如不在列表中展示的条件需要自定义 |
| showFuzzySearch | `boolean` | ❌ | 是否展示模糊搜索 |
| searchOnChange | `(value: string) => void` | ❌ | search条件切换触发的回调 |
| polling | `number` | ❌ | 局部轮询间隔 默认与页面轮询间隔一致, falsy 值表示不开启局部轮询 |
| fetchRequest | `({` | ✅ | 构造数据轮询请求，返回新的单条数据 @param {Record<string, any>} params - 表格外部状态 @param {Record<string, any>} record - 当前行数据 @return {Promise<Record<string, any>>} 新的单条数据 fetchResult |
| params | `Record<string, any>` | ❌ | - |
| record | `Record<string, any>` | ✅ | - |
| require | `({` | ✅ | 轮询开启/终止条件 @param {Record<string, any>} params - 表格外部状态 @param {Record<string, any>} record - 当前行数据 @return {boolean} true 开启轮询，false 终止轮询 |
| params | `Record<string, any>` | ❌ | - |
| record | `Record<string, any>` | ✅ | - |
| process | `({` | ✅ | 数据轮询请求 更新当前页面数据 @param {Record<string, any>} params - 表格外部状态 @param {Record<string, any>} record - 当前行数据 @param {Record<string, any>} fetchResult - 新的单条数据 @param {string} errorMsg - 错误信息 @param {'polling' | 'success' | 'error'} pollState - 轮询状态 @param {Record<string, any>} dataSource - 当前页面数据 @return {Record<string, any>} nextRecord 更新各回调函数中传入的单条数据, 返回falsy值表示不更新 |
| params | `Record<string, any>` | ❌ | - |
| record | `Record<string, any>` | ✅ | - |
| fetchResult | `Record<string, any>` | ❌ | - |
| errorMsg | `string` | ❌ | - |
| pollState | `'polling' | 'success' | 'error'` | ✅ | - |
| columns | `ProColumn[]` | ✅ | 见ProColumn API |
| batchRequest | `batchRequestProps` | ❌ | 批加载数量，非分页模式下提高渲染性能 |
| dataSource | `T[]` | ❌ | 数据源 |
| defaultData | `T[]` | ❌ | 默认的数据 |
| style | `React.CSSProperties` | ❌ | 自定义样式 |
| loading | `boolean` | ❌ | - |
| actionRef | `Ref<ActionType | undefined>` | ❌ | 初始化的参数，可以操作 table  @example 重新刷新表格 actionRef.current?.reload(); |
| ref | `Ref<Table | undefined>` | ❌ | ref 对象 |
| replacementNull | `string` | ❌ | 替换 undefind,null ,string 等 |
| handleSearch | `(` | ❌ | 自定义表格筛选，PS:formMap是高级表单产生的数据 |
| row | `any,` | ✅ | - |
| searchValue | `string,` | ✅ | - |
| filterMap | `Record<string, string>,` | ✅ | - |
| formMap | `Record<string, any>,` | ✅ | - |
| searchKey | `string,` | ❌ | - |
| exactSearchKeys | `string[],` | ❌ | 精确搜索关键字 |
| onConditionChange | `(` | ❌ | 回调删选条件 ， PS：formMap高级表单的筛选参数 |
| condition | `TableConditionChangeEventOrder & {` | ✅ | - |
| searchKey | `string` | ✅ | - |
| filterMap | `Record<string, string>` | ✅ | - |
| formMap | `Record<string, any>` | ✅ | - |
| formatColumns | `(columns: ProColumn[], dataSource: T[]) => ProColumn[]` | ❌ | 格式化列 , 返回新的columns |
| request | `(` | ❌ | 远程获取 dataSource 的方法 会同时开启 doNotHandleCondition， 远程数据。不支持内部筛选 |
| params | `U & {` | ✅ | - |
| pageSize | `number` | ❌ | - |
| current | `number` | ❌ | - |
| keyword | `string` | ❌ | - |
| sort | `Record<string, SortOrder>,` | ✅ | - |
| filters | `Record<string, (string | number)[] | null>[],` | ✅ | - |
| search | `Record<string, string>,` | ❌ | - |
| params | `U` | ❌ | request 的自定义参数，修改之后会触发更新  @example pathname 修改重新触发 request params={{ pathName }} |
| onDataSourceChange | `(dataSource: T[]) => void` | ❌ | 可编辑表格修改数据的改变 |
| onLoad | `(dataSource: T[], extra: any) => void` | ❌ | 数据加载完成后触发 |
| onLoadingChange | `(loading: boolean | undefined) => void` | ❌ | loading 被修改时触发，一般是网络请求导致的 |
| onRequestError | `(e: Error) => void` | ❌ | 数据加载失败时触发 |
| postData | `any` | ❌ | 对数据进行一些处理 |
| revalidateOnFocus | `boolean` | ❌ | 只在request 存在的时候生效，可编辑表格也不会生效  @default true 窗口聚焦时自动重新请求 |
| polling | `number` | ❌ | 页面轮询 间隔 polling 表示轮询的时间间隔，0 表示关闭轮询，大于 0 表示开启轮询，最小的轮询时间为 2000ms |
| recordPollOptions | `RecordPollOptions` | ❌ | 局部数据轮询选项, 见 RecordPollOptions API |
| debounceTime | `number` | ❌ | 去抖时间 |
| toolbar | `ProTableToolBar<T>` | ❌ | 工具栏配置见ProTableToolBar API |
| columnResizable | `boolean` | ❌ | - |
| ErrorBoundary | `ComponentClass<any, any> | false` | ❌ | 错误边界自定义 |
| columns | `ProColumn[]` | ✅ | 见ProColumn API |
| batchRequest | `batchRequestProps` | ❌ | 批加载数量，非分页模式下提高渲染性能 |
| dataSource | `T[]` | ❌ | 数据源 |
| defaultData | `T[]` | ❌ | 默认的数据 |
| style | `React.CSSProperties` | ❌ | 自定义样式 |
| loading | `boolean` | ❌ | - |
| actionRef | `any` | ❌ | 初始化的参数，可以操作 table  @example 重新刷新表格 详细见actionRef API actionRef.current?.reload(); |
| ref | `Ref<Table | undefined>` | ❌ | ref 对象 |
| replacementNull | `string` | ❌ | 替换 undefind,null ,string 等 |
| handleSearch | `(` | ❌ | 自定义表格筛选，PS:formMap是高级表单产生的数据 |
| row | `any,` | ✅ | - |
| searchValue | `string,` | ✅ | - |
| filterMap | `Record<string, string>,` | ✅ | - |
| formMap | `Record<string, any>,` | ✅ | - |
| searchKey | `string,` | ❌ | - |
| onConditionChange | `(` | ❌ | 回调删选条件 ， PS：formMap高级表单的筛选参数 |
| condition | `TableConditionChangeEventOrder & {` | ✅ | - |
| searchKey | `string` | ✅ | - |
| filterMap | `Record<string, string>` | ✅ | - |
| formMap | `Record<string, any>` | ✅ | - |
| request | `(` | ❌ | 远程获取 dataSource 的方法 会同时开启 doNotHandleCondition， 远程数据。不支持内部筛选 |
| params | `U & {` | ✅ | - |
| pageSize | `number` | ❌ | - |
| current | `number` | ❌ | - |
| keyword | `string` | ❌ | - |
| sort | `Record<string, SortOrder>,` | ✅ | - |
| filters | `Record<string, (string | number)[] | null>[],` | ✅ | - |
| search | `Record<string, string>,` | ❌ | - |
| params | `U` | ❌ | request 的自定义参数，修改之后会触发request重新请求 有局部数据轮询时，会作为表格外部状态传入局部轮询的各回调函数 @example pathname 修改重新触发 request params={{ pathName }} |
| onDataSourceChange | `(dataSource: any) => void` | ❌ | 可编辑表格修改数据的改变 |
| onLoad | `(dataSource: any) => void` | ❌ | 数据加载完成后触发 |
| onLoadingChange | `(loading?: boolean) => void` | ❌ | loading 被修改时触发，一般是网络请求导致的 |
| onRequestError | `(e: any) => void` | ❌ | 数据加载失败时触发 |
| postData | `any` | ❌ | 对数据进行一些处理 |
| revalidateOnFocus | `boolean` | ❌ | 只在request 存在的时候生效，可编辑表格也不会生效  @default true 窗口聚焦时自动重新请求 |
| polling | `number` | ❌ | 是否轮询 polling 表示轮询的时间间隔，0 表示关闭轮询，大于 0 表示开启轮询 |
| recordPollOptions | `RecordPollOptions` | ❌ | 局部数据轮询选项 见RecordPollOptions API; 有局部数据需要轮询时，暂停页面轮询，没有局部数据需要轮询时，自动回退到页面轮询 |
| debounceTime | `number` | ❌ | 去抖时间 |
| toolbar | `any` | ❌ | 工具栏配置见ProTableToolBar API |
| columnResizable | `boolean` | ❌ | - |
| ErrorBoundary | `ComponentClass<any, any> | false` | ❌ | 错误边界自定义 |
| polling | `number` | ❌ | 局部轮询间隔 默认与页面轮询间隔一致, falsy 值表示不开启局部轮询 |

## 完整 API 文档

详见 [在线文档](http://console-ops.page.ucloudadmin.com/pro-components/components/table)

## 注意事项

- 安装需使用内部 npm registry: `--registry=http://registry.npm.pre.ucloudadmin.com`
- 可在任意 React 项目中使用（不依赖控制台环境）

---
*source: auto-sync from console-ops/pro-components*
