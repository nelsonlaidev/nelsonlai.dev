'use client'

import type { Node } from '@/components/ui/tree-view'

import { createTreeCollection, TreeView as UITreeView } from '@/components/ui/tree-view'

type TreeViewProps = { collection: Node } & Omit<React.ComponentProps<typeof UITreeView>, 'collection'>

export function TreeView(props: TreeViewProps) {
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
