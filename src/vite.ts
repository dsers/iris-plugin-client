import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

import {
  appendPeersExport,
  peersExportSource,
  sharedModuleSource,
  sourceExportsPeers,
  type SharedField,
} from "./sharedRuntime.ts"

const sharedFields = {
  react: "react",
  "react-dom": "reactDOM",
  "react/jsx-runtime": "jsxRuntime",
} as const satisfies Record<string, SharedField>

const prefix = "\0iris-shared:"

type ResolveFn = (
  source: string,
  importer?: string,
  options?: { skipSelf?: boolean },
) => Promise<{ id: string } | null>

export function irisPlugin() {
  let entryFile = ""
  let peersSource: string | null = null

  return {
    name: "iris-shared-runtime",
    enforce: "pre" as const,
    configResolved(config: {
      root: string
      build: { rollupOptions: { input?: unknown } }
    }) {
      const input = config.build.rollupOptions.input
      if (typeof input !== "string") {
        throw new Error("irisPlugin requires rollupOptions.input to be a string")
      }
      entryFile = input
      const pkgPath = path.join(config.root, "package.json")
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8")) as {
        peerDependencies?: unknown
      }
      peersSource = peersExportSource(pkg.peerDependencies)
    },
    resolveId(id: string) {
      if (Object.prototype.hasOwnProperty.call(sharedFields, id)) return prefix + id
      return null
    },
    async load(this: { resolve: ResolveFn }, id: string) {
      if (!id.startsWith(prefix)) return null
      const specifier = id.slice(prefix.length)
      const field = sharedFields[specifier as keyof typeof sharedFields]
      if (!field) return null
      const resolved = await this.resolve(specifier, entryFile, { skipSelf: true })
      if (!resolved) {
        throw new Error(`iris plugin cannot resolve shared module ${specifier}`)
      }
      const nested = (
        resolved as { meta?: { commonjs?: { resolved?: { id?: string } } } }
      ).meta?.commonjs?.resolved?.id
      const fileId = (nested ?? resolved.id).replace(/^\0/, "").split("?")[0]
      const mod = (await import(pathToFileURL(fileId).href)) as Record<string, unknown>
      const names = Object.keys(mod)
      return sharedModuleSource(field, names)
    },
    transform(this: { error: (message: string) => never }, code: string, id: string) {
      const clean = id.split("?")[0]
      if (!entryFile || path.resolve(clean) !== path.resolve(entryFile)) return null
      if (sourceExportsPeers(code)) {
        this.error("plugin source already exports peers")
      }
      if (!peersSource) return null
      return appendPeersExport(code, peersSource)
    },
  }
}