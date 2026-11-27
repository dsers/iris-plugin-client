export type SharedField = "react" | "reactDOM" | "jsxRuntime"

const identifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/

export function sharedModuleSource(field: SharedField, exportNames: readonly string[]): string {
  const named = exportNames
    .filter((name) => name !== "default" && name !== "__esModule" && identifier.test(name))
    .map((name) => `export const ${name} = api.${name}`)
    .join("\n")
  return [
    "const runtime = globalThis.__IRIS_PLUGIN_SHARED__",
    `if (!runtime || runtime.${field} == null) {`,
    '  throw new Error("iris plugin shared runtime missing")',
    "}",
    `const api = runtime.${field}`,
    named,
    "export default api",
    "",
  ].join("\n")
}

export function peersExportSource(peerDependencies: unknown): string | null {
  if (peerDependencies == null) return null
  if (typeof peerDependencies !== "object" || Array.isArray(peerDependencies)) return null
  const peers: Record<string, string> = {}
  for (const [key, value] of Object.entries(peerDependencies)) {
    if (typeof value === "string") peers[key] = value
  }
  return `export const peers = ${JSON.stringify(peers)}`
}

export function appendPeersExport(code: string, peersSource: string): string {
  return `${code.trimEnd()}\n${peersSource}\n`
}

export function sourceExportsPeers(code: string): boolean {
  return (
    /export\s+(?:const|let|var|function|class)\s+peers\b/.test(code) ||
    /export\s*\{[^}]*\bpeers\b/.test(code)
  )
}