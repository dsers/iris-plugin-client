import type { Dispose } from "./dispose.ts"

export type Translate = (key: string) => string

export interface LocaleMessages {
  zh: Record<string, string>
  en: Record<string, string>
}

export interface Locale {
  register(namespace: string, messages: LocaleMessages): Dispose
  bind(namespace: string): Translate
}
