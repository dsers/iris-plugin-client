/**
 * 左栏置顶的只读视图。
 * `pinned` 只回答「现在是不是置顶」，不会在状态变化时回调。
 * 变化要另用 `ctx.on("sidebar/pin")` 订阅；订阅时不会补发当前值。
 * 插件不能自己改置顶，只能读。
 */
export interface Sidebar {
  /** `id` 是插件在左栏槽上登记的 id，通常等于插件 id。 */
  pinned(id: string): boolean
}

/**
 * 左栏插件行的登记信息。
 * `name` 固定是 `"sidebar.panellist"`，用来区分这是左栏槽而不是主区槽。
 */
export interface SidebarSlotMeta {
  name: "sidebar.panellist"
  /** 这一行的 id。同一 id 再次登记会替换上一行。 */
  id: string
  /** 多行时的排序。不写则由宿主按默认顺序排。 */
  order?: number
  /** `label` 里用来取文案的命名空间，须已经 `locale.register`。 */
  locale: string
  /**
   * 左栏每次渲染都会调用，用返回值当这一行的标题。
   * 置顶后的标题也在这里决定，例如读取 `sidebar.pinned(id)` 再选不同的文案键。
   * 返回空白时，宿主改用插件目录里的标题。
   */
  label: () => string
}

/**
 * 左栏图标组件收到的属性。
 * `size` 是宿主给出的边长，图标按这个尺寸画，不要自己写死像素。
 */
export interface SidebarIconProps {
  size: number
}

/**
 * 置顶状态变化。
 * `id` 是被切换的那一行，`pinned` 是切换后的值。
 * 只在变化时发出，打开插件或刚订阅时不会收到当前状态。
 */
export interface SidebarPinEvent {
  id: string
  pinned: boolean
}
