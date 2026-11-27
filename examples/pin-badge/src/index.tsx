import type { Context, Translate } from "@dsers/iris-plugin-client"
import { useState } from "react"
import css from "./panel.css?raw"
import { en, zh } from "./locales"

export const manifest = {
  id: "pin-badge",
  title: "Pin Badge",
  order: 0,
}

const NS = "pinBadge"

export const inject = ["slots", "sidebar", "locale"] as const

function Mark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M6 4h12v3l-2 2v11l-4-2-4 2V9L6 7z" fill="currentColor" />
    </svg>
  )
}

function Panel({ pinned, t }: { pinned: boolean; t: Translate }) {
  const [detail, setDetail] = useState<React.ReactNode>(null)

  async function openDetail() {
    const mod = await import("./detail")
    setDetail(<mod.Detail />)
  }

  return (
    <div className="pin-badge">
      <style data-plugin-css="pin-badge">{css}</style>
      <p>{t(pinned ? "pinned" : "unpinned")}</p>
      <button type="button" onClick={() => void openDetail()}>
        {t("detail")}
      </button>
      {detail}
    </div>
  )
}

export function apply(ctx: Context): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }))
  const t = ctx.locale.bind(NS)

  ctx.slots.inject("sidebar.panellist", () =>
    ctx.slots.register(
      {
        name: "sidebar.panellist",
        id: manifest.id,
        order: manifest.order,
        locale: NS,
        label: () => t(ctx.sidebar.pinned(manifest.id) ? "panelPinned" : "panel"),
      },
      ({ size }) => <Mark size={size} />,
    ),
  )

  ctx.slots.inject("main", () =>
    ctx.slots.register(
      { name: "main", key: manifest.id, locale: NS, inject: () => ({}) },
      (props) => <Panel pinned={props.pinned} t={props.t} />,
    ),
  )
}
