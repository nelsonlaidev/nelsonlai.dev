import { allPages } from 'content-collections'
import { describe, expect, test } from 'vitest'

import { locales } from '@/paraglide/runtime'

describe('public content route coverage', () => {
  test('provides every content page in every supported locale', () => {
    const slugs = new Set(allPages.map((page) => page.slug))

    for (const locale of locales) {
      const translated = allPages.filter((page) => page.locale === locale).map((page) => page.slug)
      expect(new Set(translated)).toEqual(slugs)
    }
  })
})
