import { TreeView as TreeViewPrimitive } from '@ark-ui/react/tree-view'
import { cn } from 'cn'
import { ChevronRightIcon, FileIcon, FolderIcon } from 'lucide-react'

import { useUITranslation } from './ui-provider'

type Node = {
  id: string
  name: string
  children?: Node[]
}

type TreeViewProps = React.ComponentProps<typeof TreeViewPrimitive.Root<Node>> & {
  label?: string
}

export function TreeView(props: TreeViewProps) {
  const { collection, className, label: labelProp, ...rest } = props

  const label = useUITranslation('treeView', labelProp)

  return (
    <TreeViewPrimitive.Root
      data-slot='tree-view'
      collection={collection}
      className={cn('rounded-md border bg-card p-1 sm:p-2', className)}
      {...rest}
    >
      <TreeViewPrimitive.Label className='sr-only'>{label}</TreeViewPrimitive.Label>
      <TreeViewPrimitive.Tree aria-label={label}>
        {collection.rootNode.children?.map((node, index) => (
          <TreeViewNode key={node.id} node={node} indexPath={[index]} />
        ))}
      </TreeViewPrimitive.Tree>
    </TreeViewPrimitive.Root>
  )
}

type TreeViewNodeProps = TreeViewPrimitive.NodeProviderProps<Node>

export function TreeViewNode(props: TreeViewNodeProps) {
  const { node, indexPath } = props

  return (
    <TreeViewPrimitive.NodeProvider data-slot='tree-view-node' node={node} indexPath={indexPath}>
      {node.children ? (
        <TreeViewPrimitive.Branch>
          <TreeViewPrimitive.BranchControl className='flex items-center justify-between rounded-sm p-2 text-sm hover:bg-accent hover:text-accent-foreground focus-visible:-outline-offset-2'>
            <TreeViewPrimitive.BranchText className='flex items-center gap-2'>
              <FolderIcon aria-hidden='true' className='size-4' /> {node.name}
            </TreeViewPrimitive.BranchText>
            <TreeViewPrimitive.BranchIndicator className='data-open:[&>svg]:rotate-90'>
              <ChevronRightIcon aria-hidden='true' className='size-4 transition-transform duration-200' />
            </TreeViewPrimitive.BranchIndicator>
          </TreeViewPrimitive.BranchControl>
          <TreeViewPrimitive.BranchContent className='ml-2 overflow-hidden motion-reduce:animate-none data-open:animate-tree-view-content-down data-closed:animate-tree-view-content-up'>
            <TreeViewPrimitive.BranchIndentGuide />
            {node.children.map((child, index) => (
              <TreeViewNode key={child.id} node={child} indexPath={[...indexPath, index]} />
            ))}
          </TreeViewPrimitive.BranchContent>
        </TreeViewPrimitive.Branch>
      ) : (
        <TreeViewPrimitive.Item className='relative rounded-sm p-2 text-sm hover:bg-accent hover:text-accent-foreground focus-visible:-outline-offset-2 data-selected:bg-accent'>
          <TreeViewPrimitive.ItemText className='flex items-center gap-2'>
            <FileIcon aria-hidden='true' className='size-4' />
            {node.name}
          </TreeViewPrimitive.ItemText>
        </TreeViewPrimitive.Item>
      )}
    </TreeViewPrimitive.NodeProvider>
  )
}

export type { Node }
export { createTreeCollection } from '@ark-ui/react/tree-view'
