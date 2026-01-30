'use client'

import { Sidebar, SidebarContent } from '@/components/ui/sidebar'
import { ADMIN_SIDEBAR_LINKS } from '@/config/admin-sidebar-links'

import AdminNavGroup from './admin-nav-group'

function AdminSidebar() {
  return (
    <Sidebar collapsible='icon' variant='floating'>
      <SidebarContent>
        {ADMIN_SIDEBAR_LINKS.map((group) => (
          <AdminNavGroup key={group.titleKey} {...group} />
        ))}
      </SidebarContent>
    </Sidebar>
  )
}

export default AdminSidebar
