import 'mdast-util-to-hast'

import type { Root } from 'mdast'
import type { Transformer } from 'unified'
import type { TOC } from '../types'

import GithubSlugger from 'github-slugger'
import { toString } from 'mdast-util-to-string'
import { visit } from 'unist-util-visit'

/** Collect the TOC while assigning the rendered headings their IDs. */
export function remarkHeadings(): Transformer<Root> {
  return (tree, file) => {
    const slugger = new GithubSlugger()
    const toc: TOC[] = []

    visit(tree, 'heading', (node) => {
      const title = toString(node)
      const id = slugger.slug(title)
      node.data ??= {}
      node.data.hProperties ??= {}
      node.data.hProperties.id = id
      toc.push({ title, url: id, depth: node.depth })
    })

    file.data.toc = toc
  }
}
