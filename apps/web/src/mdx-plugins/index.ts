import type { PluggableList } from 'unified'

import remarkGfm from 'remark-gfm'

import { rehypeCode } from './rehype/rehype-code'
import { rehypeInlineCode } from './rehype/rehype-inline-code'
import { remarkHeading } from './remark/remark-heading'

export const remarkPlugins: PluggableList = [remarkGfm, remarkHeading]
export const rehypePlugins: PluggableList = [rehypeCode, rehypeInlineCode]

export type * from './types'
export * from './utils'
