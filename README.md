# @baojiliu/iris-plugin-client

Iris 前端插件与宿主共用的契约。插件从这里导入 `Context`，不在插件里再声明一份。宿主实现 `slots`、`sidebar` 和 `locale`，并在 `inject` 列出的服务就绪后调用 `apply(ctx)`。

`@baojiliu/iris-plugin-client/vite` 导出 `irisPlugin()`。插件构建用它把 `react`、`react-dom`、`react/jsx-runtime` 换成宿主提供的同一份，并按 `peerDependencies` 写入口上的 `peers`。
