import type { Locale } from '@/paraglide/runtime'

import { allPages } from 'content-collections'

export function findPage(slug: string, locale: Locale) {
  const page = allPages.find((page) => page.slug === slug && page.locale === locale)

  if (!page) return null

  return { title: page.title, description: page.description, mdx: page.mdx }
}
