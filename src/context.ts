import type { Dispose } from "./dispose.ts"
import type { Locale } from "./locale.ts"
import type { Sidebar, SidebarPinEvent } from "./sidebar.ts"
import type { Slots } from "./slots.ts"

export interface Context {
  slots: Slots
  sidebar: Sidebar
  locale: Locale
  on(name: "sidebar/pin", handler: (event: SidebarPinEvent) => void): Dispose
  /** Runs `setup` now. If `setup` returns a function, the host calls it when the plugin unloads. */
  effect(setup: () => void | Dispose): void
}
