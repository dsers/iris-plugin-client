/** Read-only view of sidebar pin state. Changes arrive through `ctx.on("sidebar/pin")`. */
export interface Sidebar {
  pinned(id: string): boolean
}
