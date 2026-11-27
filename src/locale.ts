import type { Dispose } from "./dispose.ts"

/**
 * 按当前宿主语言取出一条文案。
 * 由 `locale.bind(namespace)` 得到，只查这个命名空间里注册过的键。
 * 找不到键时由宿主决定回退，插件不要自己拼语言。
 */
export type Translate = (key: string) => string

/**
 * 一个命名空间下的文案表。
 * `zh` 和 `en` 的键要成对，值是给界面直接显示的字符串，不要放 HTML。
 */
export interface LocaleMessages {
  zh: Record<string, string>
  en: Record<string, string>
}

/**
 * 插件文案。
 * 插件先 `register` 自己的命名空间，再用 `bind` 拿到 `t`。
 * 宿主语言固定由壳决定，插件不能切换语言。
 */
export interface Locale {
  /**
   * 注册一个命名空间。
   * 返回的函数会卸下这次注册。同名再次注册会盖住上一份。
   */
  register(namespace: string, messages: LocaleMessages): Dispose
  /** 绑定命名空间，得到只查这份文案的 `t`。 */
  bind(namespace: string): Translate
}
