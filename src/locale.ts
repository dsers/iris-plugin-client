import type { Dispose } from "./dispose.ts"
import type { LocaleMessages } from "./localeMessages.ts"
import type { Translate } from "./translate.ts"

export interface Locale {
  register(namespace: string, messages: LocaleMessages): Dispose
  bind(namespace: string): Translate
}
