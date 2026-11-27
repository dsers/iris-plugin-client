import type { Dispose } from "./dispose.ts"
import type { Locale } from "./locale.ts"
import type { Sidebar, SidebarPinEvent } from "./sidebar.ts"
import type { Slots } from "./slots.ts"

/**
 * 插件在 `apply` 里拿到的宿主能力。
 * 插件只通过这个对象使用槽位、置顶和文案，不直接依赖宿主内部模块。
 */
export interface Context {
  /** 把界面贡献登记到左栏或主区。 */
  slots: Slots
  /** 读取左栏置顶。不能在这里修改置顶。 */
  sidebar: Sidebar
  /** 注册并读取本插件的文案。 */
  locale: Locale
  /**
   * 订阅宿主事件。
   * 目前只有 `"sidebar/pin"`：某行置顶状态变化时调用。
   * 订阅当下不会补发当前是否置顶，当前值用 `sidebar.pinned` 读。
   * 返回的函数用来取消订阅。
   */
  on(name: "sidebar/pin", handler: (event: SidebarPinEvent) => void): Dispose
  /**
   * 立刻执行 `setup`。
   * 适合在 `apply` 里注册文案、槽位以外还需要成对清理的事情。
   * 若 `setup` 返回函数，宿主在插件卸载时调用它。
   * 离开主区不算卸载，已登记的槽和文案会保留。
   */
  effect(setup: () => void | Dispose): void
}
