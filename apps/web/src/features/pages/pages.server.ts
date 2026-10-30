import type { Locale } from '@/paraglide/runtime'

import { allPages } from 'content-collections'

import { usesInventory } from '@/features/profile/uses-inventory'

export function findPage(slug: string, locale: Locale) {
  const page = allPages.find((page) => page.slug === slug && page.locale === locale)

  if (!page) return null

  const sections = slug === 'uses' ? usesInventory(page.content) : []

  return { title: page.title, description: page.description, mdx: page.mdx, sections }
}
