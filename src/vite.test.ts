import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

import react from "@vitejs/plugin-react"
import { build } from "vite"

import { irisPlugin } from "./vite.ts"

const packageRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")

test("irisPlugin resolves the three shared specifiers", () => {
  const plugin = irisPlugin()
  assert.equal(plugin.name, "iris-shared-runtime")
  assert.equal(plugin.resolveId("react"), "\0iris-shared:react")
  assert.equal(plugin.resolveId("react-dom"), "\0iris-shared:react-dom")
  assert.equal(plugin.resolveId("react/jsx-runtime"), "\0iris-shared:react/jsx-runtime")
  assert.equal(plugin.resolveId("camelcase"), null)
  assert.equal(plugin.enforce, "pre")
})

test("irisPlugin build externalizes React via shared runtime", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "iris-vite-plugin-"))
  const entryFile = path.join(root, "entry.tsx")
  const pkgPath = path.join(root, "package.json")
  const outDir = path.join(root, "dist")

  await fs.writeFile(
    pkgPath,
    JSON.stringify(
      {
        name: "iris-plugin-fixture",
        type: "module",
        peerDependencies: {
          react: "^19.0.0",
          "react-dom": "^19.0.0",
        },
      },
      null,
      2,
    ),
  )
  await fs.writeFile(
    entryFile,
    [
      'import { useState } from "react"',
      "",
      "export function Widget() {",
      "  const [n, setN] = useState(0)",
      "  return <button type=\"button\" onClick={() => setN(n + 1)}>{n}</button>",
      "}",
      "",
    ].join("\n"),
  )
  await fs.symlink(path.join(packageRoot, "node_modules"), path.join(root, "node_modules"))

  try {
    await build({
      root,
      logLevel: "silent",
      plugins: [react(), irisPlugin()],
      build: {
        lib: {
          entry: entryFile,
          formats: ["es"],
          fileName: "plugin",
        },
        minify: false,
        modulePreload: false,
        preserveEntrySignatures: "exports-only",
        outDir,
        rollupOptions: {
          input: entryFile,
        },
      },
    })

    const bundle = await readJsBundle(outDir)

    assert.match(bundle, /__IRIS_PLUGIN_SHARED__/)
    assert.match(
      bundle,
      /(?:export const peers\s*=|const peers\s*=\s*\{[^}]*\};\s*export\s*\{[^}]*\bpeers\b)/,
    )
    assert.match(bundle, /"react"\s*:\s*"\^19\.0\.0"/)
    assert.match(bundle, /"react-dom"\s*:\s*"\^19\.0\.0"/)
    assert.doesNotMatch(bundle, /react\.production\.js/)
  } finally {
    await fs.rm(root, { recursive: true, force: true })
  }
})

async function readJsBundle(dir: string): Promise<string> {
  const files: string[] = []
  async function walk(current: string) {
    const entries = await fs.readdir(current, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name)
      if (entry.isDirectory()) await walk(fullPath)
      else if (entry.name.endsWith(".js")) files.push(fullPath)
    }
  }
  await walk(dir)
  const chunks = await Promise.all(files.map((file) => fs.readFile(file, "utf8")))
  return chunks.join("\n")
}