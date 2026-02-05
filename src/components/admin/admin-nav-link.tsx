import type { SidebarLink } from '@/config/admin-sidebar-links'

import { useTranslations } from 'next-intl'

import { Link } from '@/components/ui/link'
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { usePathname } from '@/i18n/routing'

type AdminNavLinkProps = SidebarLink

function AdminNavLink(props: AdminNavLinkProps) {
  const { titleKey, url, icon: Icon } = props
  const t = useTranslations()
  const pathname = usePathname()
  const isActive = url === pathname

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        render={
          <Link href={url}>
            <Icon />
            <span>{t(titleKey)}</span>
          </Link>
        }
      />
    </SidebarMenuItem>
  )
}

export default AdminNavLink
