import { linkOptions } from '@tanstack/react-router'

import { m } from '@/paraglide/messages'

export const ACCOUNT_LINKS = linkOptions([
  { to: '/account', label: m.common_labels_account },
  { to: '/account/settings', label: m.common_labels_settings },
])

export const HEADER_LINKS = linkOptions([
  { to: '/blog', label: m.nav_blog },
  { to: '/guestbook', label: m.nav_guestbook },
  { to: '/dashboard', label: m.nav_dashboard },
  { to: '/projects', label: m.nav_projects },
  { to: '/about', label: m.nav_about },
  { to: '/uses', label: m.nav_uses },
])
