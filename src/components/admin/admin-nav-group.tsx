import type { SidebarGroup as SidebarGroupConfig } from '@/config/admin-sidebar-links'

import { useTranslations } from 'next-intl'

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu } from '@/components/ui/sidebar'

import AdminNavLink from './admin-nav-link'

type AdminNavGroupProps = SidebarGroupConfig

function AdminNavGroup(props: AdminNavGroupProps) {
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
