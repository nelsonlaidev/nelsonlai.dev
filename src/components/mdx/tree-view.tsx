'use client'

import { createTreeCollection, TreeView as UITreeView } from '@/components/ui/tree-view'
import type { Node } from '@/components/ui/tree-view'

type TreeViewProps = { collection: Node } & Omit<React.ComponentProps<typeof UITreeView>, 'collection'>

function TreeView(props: TreeViewProps) {
  const { collection, ...rest } = props

  return (
    <UITreeView
      collection={createTreeCollection({
        nodeToValue: (node) => node.id,
        nodeToString: (node) => node.name,
        rootNode: collection,
      })}
      {...rest}
    />
  )
}

export default TreeView
