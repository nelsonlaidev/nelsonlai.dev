import { compile } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'

import { rehypeHeading } from './rehype/rehype-heading'

export async function getTOC(content: string) {
  const result = await compile(content, { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeHeading] })

  return result.data.toc ?? []
}
