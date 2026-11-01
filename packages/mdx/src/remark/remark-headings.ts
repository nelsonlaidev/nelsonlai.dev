import type { Root } from 'mdast'
import type { Transformer } from 'unified'
import type { TOC } from '../types'

import { valueToEstree } from 'estree-util-value-to-estree'
import GithubSlugger from 'github-slugger'
import { toString } from 'mdast-util-to-string'
import { visit } from 'unist-util-visit'

/** Export the TOC while assigning the rendered headings their IDs in the same pass. */
export function remarkHeadings(): Transformer<Root> {
  return (tree) => {
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

    tree.children.push({
      type: 'mdxjsEsm',
      value: '',
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ExportNamedDeclaration',
              specifiers: [],
              source: null,
              attributes: [],
              declaration: {
                type: 'VariableDeclaration',
                kind: 'const',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: { type: 'Identifier', name: 'toc' },
                    init: valueToEstree(toc),
                  },
                ],
              },
            },
          ],
        },
      },
    })
  }
}
