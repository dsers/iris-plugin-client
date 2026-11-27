import type { Context } from "./context.ts"
import type { ServiceName } from "./serviceName.ts"

export interface PluginModule {
  inject: readonly ServiceName[]
  apply(ctx: Context): void
  peers?: Record<string, string>
}
