import { linkOptions } from '@tanstack/react-router'
import { BarChartIcon, FlameIcon, MessageCircleIcon, MonitorIcon, PencilIcon, UserCircleIcon } from 'lucide-react'

import { m } from '@/paraglide/messages'

import { SITE } from './site'
import { SOCIAL_LINKS } from './social-links'

export const ACCOUNT_LINKS = linkOptions([
  { to: '/account', label: m.common_labels_account },
  { to: '/account/settings', label: m.common_labels_settings },
])

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

type FooterLink = { label: string | (() => string) } & ({ to: string } | { href: string })

export const FOOTER_GROUPS: Array<{ id: string; links: FooterLink[] }> = [
  {
    id: 'main',
    links: [
      { to: '/', label: m.nav_home },
      { to: '/blog', label: m.nav_blog },
      { to: '/about', label: m.nav_about },
      { to: '/dashboard', label: m.nav_dashboard },
    ],
  },
  {
    id: 'site',
    links: [
      { to: '/guestbook', label: m.nav_guestbook },
      { to: '/uses', label: m.nav_uses },
      { to: '/projects', label: m.nav_projects },
      { href: SITE.links, label: m.common_labels_links },
    ],
  },
  {
    id: 'social',
    links: SOCIAL_LINKS.map(({ href, title }) => ({ href, label: title })),
  },
  {
    id: 'legal',
    links: [
      { to: '/terms', label: m.common_labels_terms },
      { to: '/privacy', label: m.common_labels_privacy },
    ],
  },
]
