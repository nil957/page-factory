# Locale

> Console 业务组件 — **仅可在控制台项目中使用**

## 引入

```jsx
import { Locale } from 'common-components';
```

## Props

*Props 信息待补充*

## 用法示例

> 注意：示例中的 `CommonComponents` 是文档环境变量，实际使用时直接 import

```jsx
() => {
    const { Locale } = CommonComponents;

    const marginStyle = { margin: 10 };
    const url1 = 'dashboard';
    // LOCALE_NO_TAG            ---> 不含标签的语言场景
    // LOCALE_A_LINK            ---> 新建标签页打开<a href={url1} target='_blank'>链接文字</a>，其中变量 url1 通过 values 传递
    // LOCALE_ONCLICK           ---> 点击onClick 场景。<a onClick={onClick}>点击文字</a>
    // LOCALE_MULTIPLY_PARAM    ---> <a onClick={onClick1} style={style}>点击文字1</a>，<a onClick={onClick2} style={style2}>点击文字2</a>
    // LOCALE_MULTIPLY_PARAMS_2 ---> {num1}.<a href={val1}/{val2}>这是第{num1}个标签</a>。{num2}.<a onClick={onClick2}>这是第{num2}个标签</a>。

    return (
        <div>
            <div style={marginStyle}>
                <Locale localeKey="LOCALE_NO_TAG" />
            </div>
            <div style={marginStyle}>
                翻译地域可用区：
                <Locale localeKey="cn-bj2-02" toUpperCase={true} />
            </div>
            <div style={marginStyle}>
                <Locale localeKey="LOCALE_A_LINK" values={{ url1 }} hasTag={true} />
            </div>
            <div style={marginStyle}>
                <Locale localeKey="LOCALE_ONCLICK" values={{ onClick: () => console.log('click') }} hasTag={true} />
            </div>
            <div style={marginStyle}>
                <Locale
                    localeKey="LOCALE_MULTIPLY_PARAM"
                    values={{
                        onClick1: () => console.log('click111'),
                        onClick2: () => console.log('click222'),
                        style: { color: '#00f' },
                        style2: { color: '#f00' }
                    }}
                    hasTag={true}
                />
            </div>
            <div style={marginStyle}>
                <Locale
                    localeKey="LOCALE_MULTIPLY_PARAMS_2"
                    values={{ val1: url1, val2: 'xxx', num1: 1, num2: 2, onClick2: () => console.log('onClick2') }}
                    hasTag={true}
                />
            </div>
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
