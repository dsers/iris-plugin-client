import type { Context } from "./context.ts"
import type { ServiceName } from "./serviceName.ts"

/**
 * 插件入口模块必须导出的形状。
 * 宿主 `import` 入口之后先看 `peers`，通过才调用 `apply`。
 * `apply` 里才能登记槽位；入口文件顶层不要登记。
 */
export interface PluginModule {
  /**
   * 本插件要使用的宿主服务。
   * 每一项必须是 `serviceNames` 里的名字。宿主会据此确认服务已就绪。
   */
  inject: readonly ServiceName[]
  /**
   * 插件的启动函数，成功路径上只调用一次。
   * 在这里 `locale.register`、`slots.inject`，并按需要 `on("sidebar/pin")`。
   */
  apply(ctx: Context): void
  /**
   * 本插件声明能接受的共享库版本，值是 semver 范围。
   * 键必须正好是 `react` 和 `react-dom`。
   * 少一项、多一项、范围罩不住宿主正在跑的版本，或入口没有这个字段，宿主都不调用 `apply`。
   * `react/jsx-runtime` 跟着 `react`，不要单独写进来。
   */
  peers?: Record<string, string>
}
