import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@repo/ui/components/sidebar'
import { Link, useRouterState } from '@tanstack/react-router'
import { LayoutDashboardIcon, MessagesSquareIcon, UsersIcon } from 'lucide-react'

import { m } from '@/paraglide/messages'

const ADMIN_LINKS = [
  { to: '/admin', label: m.common_labels_dashboard, icon: LayoutDashboardIcon },
  { to: '/admin/users', label: m.common_labels_users, icon: UsersIcon },
  { to: '/admin/comments', label: m.common_labels_comments, icon: MessagesSquareIcon },
] as const

export function AdminSidebar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar collapsible='icon' variant='floating'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link to='/' />} tooltip={m.nav_home()}>
              <img src='/images/seafold.svg' width={16} height={16} alt='' className='size-4 shrink-0' />
              <span>Seafold</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{m.common_labels_general()}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ADMIN_LINKS.map((link) => (
                <SidebarMenuItem key={link.to}>
                  <SidebarMenuButton
                    isActive={link.to === pathname || `${link.to}/` === pathname}
                    tooltip={link.label()}
                    render={<Link to={link.to} />}
                    onClick={() => {
                      setOpenMobile(false)
                    }}
                  >
                    <link.icon aria-hidden='true' />
                    {link.label()}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
