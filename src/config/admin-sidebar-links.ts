import { LayoutDashboardIcon, MessagesSquareIcon, UsersIcon } from 'lucide-react'

export const ADMIN_SIDEBAR_LINKS = [
  {
    titleKey: 'common.labels.general',
    links: [
      {
        titleKey: 'common.labels.dashboard',
        url: '/admin',
        icon: LayoutDashboardIcon,
      },
      {
        titleKey: 'common.labels.users',
        url: '/admin/users',
        icon: UsersIcon,
      },
      {
        titleKey: 'common.labels.comments',
        url: '/admin/comments',
        icon: MessagesSquareIcon,
      },
    ],
  },
] as const

export type SidebarGroup = (typeof ADMIN_SIDEBAR_LINKS)[number]
export type SidebarLink = SidebarGroup['links'][number]
