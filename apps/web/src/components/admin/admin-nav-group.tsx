import type { SidebarGroup as SidebarGroupConfig } from '@/config/admin-sidebar-links'

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu } from '@repo/ui/components/sidebar'
import { useTranslations } from 'next-intl'

import AdminNavLink from './admin-nav-link'

type AdminNavGroupProps = SidebarGroupConfig

const AdminNavGroup = (props: AdminNavGroupProps) => {
  const { titleKey, links } = props
  const t = useTranslations()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t(titleKey)}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {links.map((link) => (
            <AdminNavLink key={link.titleKey} {...link} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default AdminNavGroup
