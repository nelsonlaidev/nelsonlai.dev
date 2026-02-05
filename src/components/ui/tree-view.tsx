import { TreeView as TreeViewPrimitive } from '@ark-ui/react/tree-view'
import { ChevronRightIcon, FileIcon, FolderIcon } from 'lucide-react'

import { cn } from '@/utils/cn'

type Node = {
  id: string
  name: string
  children?: Node[]
}

type TreeViewProps = {
  label?: string
} & React.ComponentProps<typeof TreeViewPrimitive.Root<Node>>

function TreeView(props: TreeViewProps) {
  const { collection, className, label = 'Tree View', ...rest } = props

  return (
    <TreeViewPrimitive.Root
      data-slot='tree-view'
      collection={collection}
      className={cn('rounded-2xl border bg-card p-4', className)}
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

function TreeViewNode(props: TreeViewNodeProps) {
  const { node, indexPath } = props

  return (
    <TreeViewPrimitive.NodeProvider data-slot='tree-view-node' key={node.id} node={node} indexPath={indexPath}>
      {node.children ? (
        <TreeViewPrimitive.Branch>
          <TreeViewPrimitive.BranchControl className='ml-[calc((var(--depth)-1)*8px)] flex items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground'>
            <TreeViewPrimitive.BranchText className='flex items-center gap-2'>
              <FolderIcon className='size-4' /> {node.name}
            </TreeViewPrimitive.BranchText>
            <TreeViewPrimitive.BranchIndicator className='data-open:[&>svg]:rotate-90'>
              <ChevronRightIcon className='size-4 transition-transform duration-200' />
            </TreeViewPrimitive.BranchIndicator>
          </TreeViewPrimitive.BranchControl>
          <TreeViewPrimitive.BranchContent className='overflow-hidden data-open:animate-tree-view-content-down data-closed:animate-tree-view-content-up'>
            <TreeViewPrimitive.BranchIndentGuide />
            {node.children.map((child, index) => (
              <TreeViewNode key={child.id} node={child} indexPath={[...indexPath, index]} />
            ))}
          </TreeViewPrimitive.BranchContent>
        </TreeViewPrimitive.Branch>
      ) : (
        <TreeViewPrimitive.Item className='relative ml-[calc((var(--depth)-1)*8px)] rounded-xl px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground data-selected:bg-accent'>
          <TreeViewPrimitive.ItemText className='flex items-center gap-2'>
            <FileIcon className='size-4' />
            {node.name}
          </TreeViewPrimitive.ItemText>
        </TreeViewPrimitive.Item>
      )}
    </TreeViewPrimitive.NodeProvider>
  )
}

export { type Node, TreeView, TreeViewNode }
export { createTreeCollection } from '@ark-ui/react/tree-view'
