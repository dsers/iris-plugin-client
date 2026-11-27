import type { Dispose } from "./dispose.ts"
import type { Translate } from "./locale.ts"
import type { SidebarIconProps, SidebarSlotMeta } from "./sidebar.ts"

/**
 * 主区面板每次渲染时收到的属性。
 * `pinned` 是当前是否置顶。`t` 是按该槽 `locale` 绑定好的翻译函数。
 */
export interface MainPanelProps {
  pinned: boolean
  t: Translate
}

/**
 * 主区槽的登记信息。
 * `name` 固定是 `"main"`。`key` 用来标识这一份主区，同一 key 再次登记会替换上一份。
 */
export interface MainSlotMeta {
  name: "main"
  key: string
  /** 主区 `t` 使用的文案命名空间。 */
  locale: string
  /**
   * 预留给主区额外注入的数据。
   * 这一版宿主不往里放内容，插件返回空对象即可。
   */
  inject: () => Record<string, never>
}

/**
 * 宿主上的界面槽。
 * 插件不能直接改宿主的 React 树，只能把贡献登记到已经声明的槽上。
 *
 * `inject` 会等到宿主声明了这个槽再执行 `register`。
 * 槽已经声明过时，`register` 会在 `inject` 返回前同步执行。
 * `register` 的返回值用来撤掉这一份贡献。
 */
export interface Slots {
  /**
   * 等槽就绪后执行登记。
   * `name` 只能是 `"main"` 或 `"sidebar.panellist"`。
   * 返回的函数会取消这次等待；如果登记已经发生，则一并撤掉贡献。
   */
  inject(name: MainSlotMeta["name"] | SidebarSlotMeta["name"], register: () => Dispose): Dispose
  /** 登记主区。`render` 的返回值由宿主当作 React 节点渲染。 */
  register(meta: MainSlotMeta, render: (props: MainPanelProps) => unknown): Dispose
  /** 登记左栏图标。`render` 收到宿主规定的图标尺寸。 */
  register(meta: SidebarSlotMeta, render: (props: SidebarIconProps) => unknown): Dispose
}
