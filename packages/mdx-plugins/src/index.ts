import type { PluggableList } from 'unified'

import remarkGfm from 'remark-gfm'

import { rehypeCode } from './rehype/rehype-code'
import { rehypeHeading } from './rehype/rehype-heading'
import { rehypeInlineCode } from './rehype/rehype-inline-code'

export const remarkPlugins: PluggableList = [remarkGfm]
export const rehypePlugins: PluggableList = [rehypeHeading, rehypeCode, rehypeInlineCode]

export { rehypeHeading } from './rehype/rehype-heading'
export type { TOC } from './types'
export { getTOC } from './utils'

export const oceanRehypePlugins: PluggableList = [rehypeHeading, [rehypeCode, { ocean: true }], rehypeInlineCode]
