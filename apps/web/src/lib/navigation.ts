import { linkOptions } from '@tanstack/react-router'
import { BarChartIcon, FlameIcon, MessageCircleIcon, MonitorIcon, PencilIcon, UserCircleIcon } from 'lucide-react'

import { m } from '@/paraglide/messages'

export const HEADER_LINKS = linkOptions([
  {
    icon: PencilIcon,
    to: '/blog',
    label: m.nav_blog,
  },
  {
    icon: MessageCircleIcon,
    to: '/guestbook',
    label: m.nav_guestbook,
  },
  {
    icon: BarChartIcon,
    to: '/dashboard',
    label: m.nav_dashboard,
  },
  {
    icon: FlameIcon,
    to: '/projects',
    label: m.nav_projects,
  },
  {
    icon: UserCircleIcon,
    to: '/about',
    label: m.nav_about,
  },
  {
    icon: MonitorIcon,
    to: '/uses',
    label: m.nav_uses,
  },
])
