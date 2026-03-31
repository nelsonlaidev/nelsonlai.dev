import type { TOC } from './types'

import { remark } from 'remark'

import { remarkHeading } from './remark/remark-heading'

type Data = {
  toc?: TOC[]
}

export async function getTOC(content: string) {
  const result = await remark().use(remarkHeading).process(content)

  const toc = (result.data as Data).toc

  return Array.isArray(toc) ? toc : []
}
