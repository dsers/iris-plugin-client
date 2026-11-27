declare module "*.css?raw" {
  const css: string
  export default css
}

declare module "camelcase" {
  export default function camelcase(input: string): string
}
