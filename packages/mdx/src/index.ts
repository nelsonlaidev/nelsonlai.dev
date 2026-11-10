import type { PluggableList } from 'unified'
import type { TOC } from './types'

import remarkGfm from 'remark-gfm'
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import { unified } from 'unified'

import { rehypeCode } from './rehype/rehype-code'
import { rehypeInlineCode } from './rehype/rehype-inline-code'
import { remarkHeadings } from './remark/remark-headings'

export const remarkPlugins: PluggableList = [remarkGfm, remarkHeadings]
export const rehypePlugins: PluggableList = [rehypeCode, rehypeInlineCode]

/** Read the TOC with the same parser and heading IDs used by the MDX compiler. */
export async function getTOC(content: string): Promise<TOC[]> {
  const processor = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).use(remarkHeadings)
  const file = { value: content, data: { toc: [] as TOC[] } }
  await processor.run(processor.parse(content), file)
  return file.data.toc
}

export type { TOC } from './types'
