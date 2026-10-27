export type TOC = {
  title: string
  url: string
  depth: number
}

declare module 'vfile' {
  // Module augmentation requires an interface for declaration merging.
  // oxlint-disable-next-line typescript/consistent-type-definitions
  interface DataMap {
    toc: TOC[]
  }
}
