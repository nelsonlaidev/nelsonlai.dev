'use client'

import { Demo, DemoItem } from '../ui/demo'
import { createTreeCollection, type Node, TreeView } from '../ui/tree-view'

const treeData: Node = {
  id: 'root',
  name: 'root',
  children: [
    {
      id: 'workspace',
      name: 'workspace',
      children: [
        {
          id: 'app',
          name: 'app',
          children: [
            {
              id: 'components',
              name: 'components',
              children: [
                { id: 'tree-view', name: 'tree-view.tsx' },
                { id: 'button', name: 'button.tsx' },
                { id: 'card', name: 'card.tsx' },
              ],
            },
            {
              id: 'routes',
              name: 'routes',
              children: [
                {
                  id: 'design',
                  name: 'design',
                  children: [{ id: 'page', name: 'page.tsx' }],
                },
              ],
            },
          ],
        },
        {
          id: 'public',
          name: 'public',
          children: [
            { id: 'logo', name: 'logo.svg' },
            { id: 'og', name: 'og-image.png' },
          ],
        },
        { id: 'readme', name: 'README.md' },
      ],
    },
    {
      id: 'notes',
      name: 'notes',
      children: [
        { id: 'roadmap', name: 'roadmap.md' },
        { id: 'ideas', name: 'ideas.md' },
      ],
    },
  ],
}

const treeCollection = createTreeCollection({
  nodeToValue: (node) => node.id,
  nodeToString: (node) => node.name,
  rootNode: treeData,
})

function TreeViewDemo() {
  return (
    <Demo title='Tree View'>
      <TreeViewBasic />
    </Demo>
  )
}

function TreeViewBasic() {
  return (
    <DemoItem title='Basic' className='justify-center'>
      <TreeView collection={treeCollection} className='w-full max-w-sm' />
    </DemoItem>
  )
}

export default TreeViewDemo
