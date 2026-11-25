import type { Node } from '@repo/ui/components/tree-view'

import { createTreeCollection, TreeView } from '@repo/ui/components/tree-view'
import { useState } from 'react'

import preview from '../.storybook/preview'

const meta = preview.meta({
  title: 'Components/Tree view',
})

const collection = createTreeCollection<Node>({
  nodeToValue: (node) => node.id,
  nodeToString: (node) => node.name,
  rootNode: {
    id: 'root',
    name: 'Root',
    children: [
      {
        id: 'components',
        name: 'Components',
        children: [
          { id: 'button', name: 'button.tsx' },
          { id: 'dialog', name: 'dialog.tsx' },
          {
            id: 'nested',
            name: 'Nested folder',
            children: [{ id: 'readme', name: 'A long documentation filename that demonstrates wrapping.md' }],
          },
        ],
      },
      { id: 'tokens', name: 'globals.css' },
    ],
  },
})

function TreeExample() {
  const [selected, setSelected] = useState<string[]>([])

  return (
    <div className='max-w-md space-y-4'>
      <TreeView
        collection={collection}
        selectedValue={selected}
        onSelectionChange={(details) => {
          setSelected(details.selectedValue)
        }}
        defaultExpandedValue={['components']}
        label='UI source files'
      />
      <output>Selected: {selected.join(', ') || 'none'}</output>
    </div>
  )
}

export const ControlledSelection = meta.story({
  render: () => <TreeExample />,
})

const emptyCollection = createTreeCollection<Node>({
  nodeToValue: (node) => node.id,
  nodeToString: (node) => node.name,
  rootNode: { id: 'root', name: 'Empty', children: [] },
})

export const Empty = meta.story({
  render: () => (
    <div className='max-w-md space-y-3'>
      <TreeView collection={emptyCollection} label='Empty file tree' />
      <p className='text-sm text-muted-foreground'>
        The component has no built-in empty message; the caller supplies this explanation.
      </p>
    </div>
  ),
})
