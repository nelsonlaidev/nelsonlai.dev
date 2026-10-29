import { readdir } from 'node:fs/promises'

import { allPages } from 'content-collections'
import { describe, expect, test } from 'vitest'

describe('public content route coverage', () => {
  test('includes all static main-layout routes in every locale', async () => {
    const files = await readdir('src/routes/_main', { recursive: true })
    const routes = files
      .filter(
        (file) =>
          file.endsWith('.tsx') &&
          !file.includes('-components') &&
          !file.startsWith('account') &&
          !file.includes('$') &&
          !file.endsWith('route.tsx'),
      )
      .map((file) => file.replaceAll(/\/index\.tsx$|\.tsx$/g, ''))
      .filter((file) => file !== 'index')
    for (const locale of new Set(allPages.map((page) => page.locale)))
      expect(routes.filter((route) => !allPages.some((page) => page.locale === locale && page.slug === route))).toEqual(
        [],
      )
  })
})
