import type { Dispose } from "./dispose.ts"
import type { MainPanelProps } from "./mainPanelProps.ts"
import type { MainSlotMeta } from "./mainSlotMeta.ts"
import type { SidebarIconProps } from "./sidebarIconProps.ts"
import type { SidebarSlotMeta } from "./sidebarSlotMeta.ts"

/**
 * React slots. `inject` waits until the host has declared the slot, then runs `register`.
 * The function returned from `register` removes that contribution.
 */
export interface Slots {
  inject(name: MainSlotMeta["name"] | SidebarSlotMeta["name"], register: () => Dispose): Dispose
  register(meta: MainSlotMeta, render: (props: MainPanelProps) => unknown): Dispose
  register(meta: SidebarSlotMeta, render: (props: SidebarIconProps) => unknown): Dispose
}
