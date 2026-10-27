import type { Node } from '@repo/ui/components/tree-view'

import { createTreeCollection, TreeView as UITreeView } from '@repo/ui/components/tree-view'

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
