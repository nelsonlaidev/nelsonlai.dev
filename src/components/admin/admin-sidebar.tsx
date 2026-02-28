'use client'

import { useTranslations } from 'next-intl'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { ADMIN_SIDEBAR_LINKS } from '@/constants/navigation'
import { usePathname } from '@/i18n/routing'

import { Link } from '../ui/link'

export function AdminSidebar() {
  const t = useTranslations()
  const pathname = usePathname()

  return (
    <Sidebar collapsible='icon' variant='floating'>
      <SidebarContent>
        {ADMIN_SIDEBAR_LINKS.map((group) => (
          <SidebarGroup key={group.titleKey}>
            <SidebarGroupLabel>{t(group.titleKey)}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.links.map((link) => (
                  <SidebarMenuItem key={link.titleKey}>
                    <SidebarMenuButton
                      isActive={link.url === pathname}
                      render={
                        <Link href={link.url}>
                          {link.icon}
                          {t(link.titleKey)}
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
