import type { Root } from 'hast'
import type { Transformer } from 'unified'
import type { TOC } from '../types'

import GithubSlugger from 'github-slugger'
import { headingRank } from 'hast-util-heading-rank'
import { toString } from 'hast-util-to-string'
import { visit } from 'unist-util-visit'

type Options = {
  prefix?: string
}

export function rehypeHeading(options?: Options): Transformer<Root> {
  const prefix = options?.prefix ?? ''

  return (tree, file) => {
    const slugs = new GithubSlugger()
    const toc: TOC[] = []

    visit(tree, 'element', (node) => {
      const depth = headingRank(node)
      if (!depth) return

      const title = toString(node)

      // An empty ID must be generated again, not preserved.
      // oxlint-disable-next-line typescript/prefer-nullish-coalescing
      if (!node.properties.id) {
        node.properties.id = prefix + slugs.slug(title)
      }

      toc.push({ title, url: node.properties.id, depth })
    })

    file.data.toc = toc
  }
}
