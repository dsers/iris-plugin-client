export interface MainSlotMeta {
  name: "main"
  key: string
  locale: string
  inject: () => Record<string, never>
}
