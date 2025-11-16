'use client'

import { createTreeCollection, type Node, TreeView } from '@repo/ui/components/tree-view'

const collection = createTreeCollection<Node>({
  nodeToValue: (node) => node.id,
  nodeToString: (node) => node.name,
  rootNode: {
    id: 'ROOT',
    name: '',
    children: [
      {
        id: 'app',
        name: 'app',
        children: [
          { id: 'app/error.tsx', name: 'error.tsx' },
          { id: 'app/layout.tsx', name: 'layout.tsx' },
          { id: 'app/not-found.tsx', name: 'not-found.tsx' },
          { id: 'app/page.tsx', name: 'page.tsx' },
          {
            id: 'app/blog',
            name: 'blog',
            children: [
              {
                id: 'app/blog/[slug]',
                name: '[slug]',
                children: [
                  {
                    id: 'app/blog/[slug]/page.tsx',
                    name: 'page.tsx'
                  }
                ]
              },
              { id: 'app/blog/page.tsx', name: 'page.tsx' }
            ]
          }
        ]
      },
      { id: 'package.json', name: 'package.json' },
      { id: 'readme.md', name: 'README.md' }
    ]
  }
})

const TreeViewDemo = () => {
  return <TreeView className='w-full max-w-md' collection={collection} />
}

export default TreeViewDemo
