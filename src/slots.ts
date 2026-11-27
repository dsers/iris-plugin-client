import type { Dispose } from "./dispose.ts"
import type { Translate } from "./locale.ts"
import type { SidebarIconProps, SidebarSlotMeta } from "./sidebar.ts"

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

/**
 * React slots. `inject` waits until the host has declared the slot, then runs `register`.
 * The function returned from `register` removes that contribution.
 */
export interface Slots {
  inject(name: MainSlotMeta["name"] | SidebarSlotMeta["name"], register: () => Dispose): Dispose
  register(meta: MainSlotMeta, render: (props: MainPanelProps) => unknown): Dispose
  register(meta: SidebarSlotMeta, render: (props: SidebarIconProps) => unknown): Dispose
}
