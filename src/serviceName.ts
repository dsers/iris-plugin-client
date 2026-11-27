/**
 * 宿主目前提供给插件的服务名。
 * 插件在 `inject` 里列出的每一项都必须是这里的名字。
 * 加载器会等这些服务都就绪后才调用 `apply`；出现未知名字则拒绝执行。
 */
export const serviceNames = ["slots", "sidebar", "locale"] as const

/** `serviceNames` 里的某一个名字。 */
export type ServiceName = (typeof serviceNames)[number]
