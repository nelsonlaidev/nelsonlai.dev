import type { Locale } from 'next-intl'

import { routing } from '@/i18n/routing'

export function getLocalizedPath(path: string, locale: Locale): string {
  if (isFullUrl(path)) {
    throw new Error(`getLocalizedPath: path must not be a full URL, got "${path}"`)
  }

  if (hasLocalePrefix(path)) {
    throw new Error(`getLocalizedPath: path must not contain a locale prefix, got "${path}"`)
  }

  if (locale === routing.defaultLocale) return path

  return `/${locale}${path}`
}

function isFullUrl(path: string): boolean {
  return path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')
}

function hasLocalePrefix(path: string): boolean {
  return routing.locales.some((locale) => path === `/${locale}` || path.startsWith(`/${locale}/`))
}
