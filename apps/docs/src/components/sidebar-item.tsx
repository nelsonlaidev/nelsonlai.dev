'use client'

import type * as PageTree from 'fumadocs-core/page-tree'

import { Badge } from '@repo/ui/components/badge'
import { SidebarItem as FDSidebarItem } from 'fumadocs-ui/components/layout/sidebar'

type SidebarItemProps = {
  item: PageTree.Item
}

function SidebarItem(props: SidebarItemProps) {
  const { item } = props

  return (
    <FDSidebarItem key={item.url} href={item.url} external={item.external} icon={item.icon}>
      {item.name}
      {item.package === 'ark-ui' && (
        <Badge className='bg-orange-600 dark:bg-orange-700 dark:text-foreground'>Ark UI</Badge>
      )}
    </FDSidebarItem>
  )
}

export default SidebarItem
