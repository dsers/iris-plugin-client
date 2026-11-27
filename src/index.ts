/**
 * Contract shared by the Iris host and frontend plugins.
 * Plugins depend on this package; they do not declare Context themselves.
 */

export type { Dispose } from "./dispose.ts"
export type { ServiceName } from "./serviceName.ts"
export { serviceNames } from "./serviceName.ts"
export type { Locale, LocaleMessages, Translate } from "./locale.ts"
export type { MainPanelProps, MainSlotMeta, Slots } from "./slots.ts"
export type { Sidebar, SidebarIconProps, SidebarPinEvent, SidebarSlotMeta } from "./sidebar.ts"
export type { Context } from "./context.ts"
export type { PluginModule } from "./pluginModule.ts"
