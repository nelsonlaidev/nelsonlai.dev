import type { Locale } from '@/paraglide/runtime'

import { allPages } from 'content-collections'

export function findPage(slug: string, locale: Locale) {
  return allPages.find((page) => page.slug === slug && page.locale === locale) ?? null
}
