import { SiFacebook, SiGithub, SiInstagram, SiX, SiYoutube } from '@icons-pack/react-simple-icons'
import {
  BarChartIcon,
  FlameIcon,
  LayoutDashboardIcon,
  MessageCircleIcon,
  MessagesSquareIcon,
  MonitorIcon,
  PencilIcon,
  UserCircleIcon,
  UsersIcon,
} from 'lucide-react'

import { SITE_FACEBOOK_URL, SITE_GITHUB_URL, SITE_INSTAGRAM_URL, SITE_X_URL, SITE_YOUTUBE_URL } from './site'

export const HEADER_LINKS = [
  {
    icon: <PencilIcon />,
    href: '/blog',
    // i18n-check t('common.labels.blog')
    labelKey: 'common.labels.blog',
  },
  {
    icon: <MessageCircleIcon />,
    href: '/guestbook',
    // i18n-check t('common.labels.guestbook')
    labelKey: 'common.labels.guestbook',
  },
  {
    icon: <BarChartIcon />,
    href: '/dashboard',
    // i18n-check t('common.labels.dashboard')
    labelKey: 'common.labels.dashboard',
  },
  {
    icon: <FlameIcon />,
    href: '/projects',
    // i18n-check t('common.labels.projects')
    labelKey: 'common.labels.projects',
  },
  {
    icon: <UserCircleIcon />,
    href: '/about',
    // i18n-check t('common.labels.about')
    labelKey: 'common.labels.about',
  },
  {
    icon: <MonitorIcon />,
    href: '/uses',
    // i18n-check t('common.labels.uses')
    labelKey: 'common.labels.uses',
  },
] as const

export const FOOTER_GROUPS = [
  {
    links: [
      // i18n-check t('common.labels.home')
      { href: '/', labelKey: 'common.labels.home' },
      // i18n-check t('common.labels.blog')
      { href: '/blog', labelKey: 'common.labels.blog' },
      // i18n-check t('common.labels.about')
      { href: '/about', labelKey: 'common.labels.about' },
      // i18n-check t('common.labels.dashboard')
      { href: '/dashboard', labelKey: 'common.labels.dashboard' },
    ],
  },
  {
    links: [
      // i18n-check t('common.labels.guestbook')
      { href: '/guestbook', labelKey: 'common.labels.guestbook' },
      // i18n-check t('common.labels.uses')
      { href: '/uses', labelKey: 'common.labels.uses' },
      // i18n-check t('common.labels.projects')
      { href: '/projects', labelKey: 'common.labels.projects' },
      // i18n-check t('common.labels.links')
      { href: 'https://nelsonlai.link', labelKey: 'common.labels.links' },
    ],
  },
  {
    links: [
      // i18n-check t('common.labels.facebook')
      { href: SITE_FACEBOOK_URL, labelKey: 'common.labels.facebook' },
      // i18n-check t('common.labels.instagram')
      { href: SITE_INSTAGRAM_URL, labelKey: 'common.labels.instagram' },
      // i18n-check t('common.labels.github')
      { href: SITE_GITHUB_URL, labelKey: 'common.labels.github' },
      // i18n-check t('common.labels.youtube')
      { href: SITE_YOUTUBE_URL, labelKey: 'common.labels.youtube' },
    ],
  },
  {
    links: [
      // i18n-check t('common.labels.terms')
      { href: '/terms', labelKey: 'common.labels.terms' },
      // i18n-check t('common.labels.privacy')
      { href: '/privacy', labelKey: 'common.labels.privacy' },
    ],
  },
] as const

export const ACCOUNT_SIDEBAR_LINKS = [
  {
    href: '/account',
    // i18n-check t('common.labels.account')
    labelKey: 'common.labels.account',
  },
  {
    href: '/account/settings',
    // i18n-check t('common.labels.settings')
    labelKey: 'common.labels.settings',
  },
] as const

export const ADMIN_SIDEBAR_LINKS = [
  {
    titleKey: 'common.labels.general',
    links: [
      {
        titleKey: 'common.labels.dashboard',
        url: '/admin',
        icon: <LayoutDashboardIcon />,
      },
      {
        titleKey: 'common.labels.users',
        url: '/admin/users',
        icon: <UsersIcon />,
      },
      {
        titleKey: 'common.labels.comments',
        url: '/admin/comments',
        icon: <MessagesSquareIcon />,
      },
    ],
  },
] as const

export const SOCIAL_LINKS = [
  {
    href: SITE_GITHUB_URL,
    title: 'GitHub',
    icon: <SiGithub />,
  },
  {
    href: SITE_FACEBOOK_URL,
    title: 'Facebook',
    icon: <SiFacebook />,
  },
  {
    href: SITE_INSTAGRAM_URL,
    title: 'Instagram',
    icon: <SiInstagram />,
  },
  {
    href: SITE_X_URL,
    title: 'X',
    icon: <SiX />,
  },
  {
    href: SITE_YOUTUBE_URL,
    title: 'YouTube',
    icon: <SiYoutube />,
  },
] as const
