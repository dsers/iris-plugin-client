/**
 * Contract shared by the Iris host and frontend plugins.
 * Plugins depend on this package; they do not declare Context themselves.
 */

export type { Dispose } from "./dispose.ts"
export type { ServiceName } from "./serviceName.ts"
export { serviceNames } from "./serviceName.ts"
export type { Translate } from "./translate.ts"
export type { LocaleMessages } from "./localeMessages.ts"
export type { Locale } from "./locale.ts"
export type { MainPanelProps } from "./mainPanelProps.ts"
export type { MainSlotMeta } from "./mainSlotMeta.ts"
export type { SidebarSlotMeta } from "./sidebarSlotMeta.ts"
export type { SidebarIconProps } from "./sidebarIconProps.ts"
export type { SidebarPinEvent } from "./sidebarPinEvent.ts"
export type { Slots } from "./slots.ts"
export type { Sidebar } from "./sidebar.ts"
export type { Context } from "./context.ts"
export type { PluginModule } from "./pluginModule.ts"
