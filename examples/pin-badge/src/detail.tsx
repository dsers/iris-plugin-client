import camelcase from "camelcase"
import css from "./detail.css?raw"

export function Detail() {
  return (
    <>
      <style data-plugin-css="pin-badge-detail">{css}</style>
      <p className="pin-badge-detail">{camelcase("pin badge")}</p>
    </>
  )
}
