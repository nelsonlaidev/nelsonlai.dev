import type { SidebarLink } from '@/config/admin-sidebar-links'

import { usePathname } from '@repo/i18n/routing'
import { Link } from '@repo/ui/components/link'
import { SidebarMenuButton, SidebarMenuItem } from '@repo/ui/components/sidebar'
import { useTranslations } from 'next-intl'

type AdminNavLinkProps = SidebarLink

const AdminNavLink = (props: AdminNavLinkProps) => {
  const { titleKey, url, icon: Icon } = props
  const t = useTranslations()
  const pathname = usePathname()
  const isActive = url === pathname

  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={isActive} asChild>
        <Link href={url}>
          <Icon />
          <span>{t(titleKey)}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export default AdminNavLink
