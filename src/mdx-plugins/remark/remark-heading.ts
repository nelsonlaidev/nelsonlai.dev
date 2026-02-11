import type { TOC } from '../types'
import type { Heading, Node } from 'mdast'
import type { VFile } from 'vfile'

import Slugger from 'github-slugger'
import { visit } from 'unist-util-visit'

const slugger = new Slugger()

function transformer(tree: Node, file: VFile) {
  const toc: TOC[] = []
  slugger.reset()

  visit(tree, 'heading', (node: Heading) => {
    node.data ??= { hProperties: {} }
    node.data.hProperties ??= {}

    const childNode = node.children[0]

    if (childNode?.type !== 'text') return

    const text = childNode.value
    const id = slugger.slug(childNode.value)

    node.data.hProperties.id = id

    toc.push({
      title: text,
      url: id,
      depth: node.depth,
    })

    return 'skip'
  })

  file.data.toc = toc
}

export function remarkHeading() {
  return transformer
}
