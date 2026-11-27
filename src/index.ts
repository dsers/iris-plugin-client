/**
 * Iris 前端插件与宿主共用的契约。
 * 插件从包入口导入这些类型，不要在插件仓库里再声明一份 `Context`。
 * 宿主实现这些接口，并在 `inject` 列出的服务就绪、且 `peers` 通过之后调用 `apply`。
 */

export type { Dispose } from "./dispose.ts"
export type { ServiceName } from "./serviceName.ts"
export { serviceNames } from "./serviceName.ts"
export type { Locale, LocaleMessages, Translate } from "./locale.ts"
export type { MainPanelProps, MainSlotMeta, Slots } from "./slots.ts"
export type { Sidebar, SidebarIconProps, SidebarPinEvent, SidebarSlotMeta } from "./sidebar.ts"
export type { Context } from "./context.ts"
export type { PluginModule } from "./pluginModule.ts"
