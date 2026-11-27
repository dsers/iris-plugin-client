import assert from "node:assert/strict"
import test from "node:test"

import {
  appendPeersExport,
  peersExportSource,
  sharedModuleSource,
  sourceExportsPeers,
} from "./sharedRuntime.ts"

test("react virtual module reads the react field and exports its own names", () => {
  const source = sharedModuleSource("react", ["useState", "default", "__esModule"])
  assert.match(source, /runtime\.react/)
  assert.match(source, /export const useState = api\.useState/)
  assert.match(source, /export default api/)
  assert.doesNotMatch(source, /__esModule/)
  assert.match(source, /iris plugin shared runtime missing/)
})

test("react-dom virtual module does not export useState", () => {
  const source = sharedModuleSource("reactDOM", ["version", "createPortal"])
  assert.match(source, /runtime\.reactDOM/)
  assert.match(source, /export const version = api\.version/)
  assert.match(source, /export const createPortal = api\.createPortal/)
  assert.doesNotMatch(source, /useState/)
})

test("peers export keeps only string ranges", () => {
  const source = peersExportSource({
    react: "^19.0.0",
    "react-dom": "^19.0.0",
    skipped: 1,
  })
  assert.equal(
    source,
    'export const peers = {"react":"^19.0.0","react-dom":"^19.0.0"}',
  )
})

test("missing peerDependencies produces no export", () => {
  assert.equal(peersExportSource(undefined), null)
})

test("appendPeersExport adds the statement to the entry", () => {
  const next = appendPeersExport("export const apply = () => {}", 'export const peers = {"react":"^19.0.0"}')
  assert.match(next, /export const apply/)
  assert.match(next, /export const peers/)
})

test("sourceExportsPeers detects an existing peers export", () => {
  assert.equal(sourceExportsPeers("export const peers = {}"), true)
  assert.equal(sourceExportsPeers("export { peers }"), true)
  assert.equal(sourceExportsPeers("export const apply = () => {}"), false)
})