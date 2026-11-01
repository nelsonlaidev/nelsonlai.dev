import type { MDXContent } from 'mdx/types'

export type TOC = {
  title: string
  url: string
  depth: number
}

export type MdxModule = {
  default: MDXContent
  toc: TOC[]
}
