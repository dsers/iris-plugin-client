/** Services a plugin may list in `inject`. The loader waits until each one exists. */
export const serviceNames = ["slots", "sidebar", "locale"] as const

export type ServiceName = (typeof serviceNames)[number]
