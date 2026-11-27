export interface SidebarSlotMeta {
  name: "sidebar.panellist"
  id: string
  order?: number
  locale: string
  /** Host calls this on each sidebar render. */
  label: () => string
}
