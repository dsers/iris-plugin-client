/** Read-only view of sidebar pin state. Changes arrive through `ctx.on("sidebar/pin")`. */
export interface Sidebar {
  pinned(id: string): boolean
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
