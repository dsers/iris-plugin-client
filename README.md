# iris-plugin-client

Iris 前端插件与宿主共用的约定。插件用它把界面放进宿主、读取置顶、显示中英文案，并在构建时和宿主共用同一份 React。

## 目录

- [安装](#安装)
- [插件怎么启动](#插件怎么启动)
- [能对宿主做什么](#能对宿主做什么)
  - [放进宿主界面](#放进宿主界面)
  - [知道自己有没有被置顶](#知道自己有没有被置顶)
  - [按宿主语言显示文案](#按宿主语言显示文案)
  - [打开时做事，卸下时清理](#打开时做事卸下时清理)
- [和宿主共用 React](#和宿主共用-react)
- [调用示例](#调用示例)

## 安装

```bash
npm install @baojiliu/iris-plugin-client
```

插件把它放在 `devDependencies`。类型只在编译时使用，不要打进插件产物。

## 插件怎么启动

入口导出三样东西：

| 导出 | 作用 |
| --- | --- |
| `inject` | 声明要用哪些宿主能力，只能是 `slots`、`sidebar`、`locale` |
| `apply(ctx)` | 启动时宿主调用一次。界面和文案都在这里登记 |
| `peers` | 声明能配合的 `react`、`react-dom` 版本 |

`peers` 的键必须正好是 `react` 和 `react-dom`，值是 semver 范围。少写、多写、范围罩不住宿主正在用的版本，或者没有这个字段，宿主都不会调用 `apply`。`react/jsx-runtime` 跟着 `react`，不要单独写。

## 能对宿主做什么

插件不改宿主的内部代码，只通过 `ctx` 使用下面这些能力。

### 放进宿主界面

`ctx.slots` 用来把插件的界面放到宿主上。现在有两个位置：

- 左栏一行。标题由 `label()` 在每次绘制时给出，图标按宿主给的尺寸来画。
- 主区。打开这一行时，宿主用插件提供的面板，并告诉它当前是否置顶。

位置还没准备好时，登记会等到它出现再执行。同一行再次登记会换掉上一次放上去的内容。登记时返回的函数可以把这次放上去的界面撤掉。

### 知道自己有没有被置顶

`ctx.sidebar.pinned(id)` 回答这一行现在是不是置顶。插件不能自己去改置顶。

若要在用户点置顶的那一刻做别的事，用 `ctx.on("sidebar/pin", handler)`。刚订上时不会补报当前状态，当前是不是置顶用 `pinned` 读。左栏标题要随置顶变化，就在 `label()` 里每次读一次。

### 按宿主语言显示文案

`ctx.locale.register` 交上一份中文和一份英文，键要成对，内容是纯文本。

`ctx.locale.bind` 得到 `t`。界面上显示哪一种语言由宿主决定，插件不能自己切换。主区面板拿到的 `t` 已经按这个插件的文案准备好了。

### 打开时做事，卸下时清理

`ctx.effect(setup)` 在 `apply` 里立刻执行。`setup` 如果返回一个函数，宿主会在插件卸下时调用它。

用户只是离开主区，插件还在。已经放上的界面和文案会留着。

## 和宿主共用 React

插件源码照常 `import` React。构建时加上 `irisPlugin()`，它会改用宿主正在跑的那一份 React，避免插件再打包一份。

`package.json` 的 `peerDependencies` 写上 `react` 和 `react-dom` 的范围。`irisPlugin()` 会把这份范围写进入口的 `peers`。版本对不对，要等插件被打开时由宿主检查。

## 调用示例

```tsx
import type { Context } from "@baojiliu/iris-plugin-client"

const NS = "showcase"

export const inject = ["slots", "sidebar", "locale"] as const

export function apply(ctx: Context) {
  ctx.effect(() => ctx.locale.register(NS, {
    zh: { panel: "Showcase", pinned: "已置顶" },
    en: { panel: "Showcase", pinned: "Pinned" },
  }))
  const t = ctx.locale.bind(NS)

  ctx.slots.inject("sidebar.panellist", () =>
    ctx.slots.register(
      {
        name: "sidebar.panellist",
        id: "showcase",
        locale: NS,
        label: () => t(ctx.sidebar.pinned("showcase") ? "pinned" : "panel"),
      },
      () => null,
    ),
  )
}
```

```ts
import { irisPlugin } from "@baojiliu/iris-plugin-client/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), irisPlugin()],
})
```
