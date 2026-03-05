import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'zh-TW', 'zh-CN', 'ja', 'es', 'pt-BR'] as const,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: true,
  localeCookie: {
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 365,
  },
})

type Locale = (typeof routing.locales)[number]
type LocaleItem = {
  label: string
  value: Locale
}

export const LOCALE_ITEMS: LocaleItem[] = [
  { label: 'English', value: 'en' },
  { label: '繁體中文', value: 'zh-TW' },
  { label: '简体中文', value: 'zh-CN' },
  { label: '日本語', value: 'ja' },
  { label: 'Español', value: 'es' },
  { label: 'Português (Brasil)', value: 'pt-BR' },
]

export const { Link, usePathname, useRouter, redirect } = createNavigation(routing)
