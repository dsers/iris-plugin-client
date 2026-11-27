/**
 * Contract shared by the Iris host and frontend plugins.
 * Plugins depend on this package; they do not declare Context themselves.
 */

export type Dispose = () => void

/** Services a plugin may list in `inject`. The loader waits until each one exists. */
export const serviceNames = ["slots", "sidebar", "locale"] as const

export type ServiceName = (typeof serviceNames)[number]

export type Translate = (key: string) => string

export interface LocaleMessages {
  zh: Record<string, string>
  en: Record<string, string>
}

export interface Locale {
  register(namespace: string, messages: LocaleMessages): Dispose
  bind(namespace: string): Translate
}

export interface MainPanelProps {
  pinned: boolean
  t: Translate
}

export interface MainSlotMeta {
  name: "main"
  key: string
  locale: string
  inject: () => Record<string, never>
}

export interface SidebarSlotMeta {
  name: "sidebar.panellist"
  id: string
  order?: number
  locale: string
  /** Host calls this on each sidebar render. */
  label: () => string
}

export interface SidebarIconProps {
  size: number
}

export interface SidebarPinEvent {
  id: string
  pinned: boolean
}

/**
 * React slots. `inject` waits until the host has declared the slot, then runs `register`.
 * The function returned from `register` removes that contribution.
 */
export interface Slots {
  inject(name: MainSlotMeta["name"] | SidebarSlotMeta["name"], register: () => Dispose): Dispose
  register(meta: MainSlotMeta, render: (props: MainPanelProps) => unknown): Dispose
  register(meta: SidebarSlotMeta, render: (props: SidebarIconProps) => unknown): Dispose
}

/** Read-only view of sidebar pin state. Changes arrive through `ctx.on("sidebar/pin")`. */
export interface Sidebar {
  pinned(id: string): boolean
}

export interface Context {
  slots: Slots
  sidebar: Sidebar
  locale: Locale
  on(name: "sidebar/pin", handler: (event: SidebarPinEvent) => void): Dispose
  /** Runs `setup` now. If `setup` returns a function, the host calls it when the plugin unloads. */
  effect(setup: () => void | Dispose): void
}

export interface PluginModule {
  inject: readonly ServiceName[]
  apply(ctx: Context): void
  peers?: Record<string, string>
}
