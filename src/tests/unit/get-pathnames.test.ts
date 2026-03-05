import fs from 'node:fs/promises'

import { describe, expect, test } from 'vitest'

import { getPathnames, PROTECTED_ROUTES } from '@/utils/get-pathnames'

describe('pathnames', () => {
  // Routes that exist as page files but are intentionally excluded from getPathnames()
  const EXCLUDED_ROUTES = ['/cosmos', '/unsubscribe', '/admin']

  test('includes all static page routes', async () => {
    expect.assertions(1)

    const pathnames = getPathnames({ includeProtectedRoutes: true })
    const staticRoutes = await getStaticPageRoutes()

    const missing = staticRoutes.filter(
      (route) =>
        !pathnames.includes(route) &&
        !EXCLUDED_ROUTES.some((excluded) => route === excluded || route.startsWith(`${excluded}/`)),
    )

    expect(missing, `Missing routes in getPathnames(): ${missing.join(', ')}`).toStrictEqual([])
  })
})

async function getStaticPageRoutes(): Promise<string[]> {
  const rootDir = 'src/app'
  const entries = await fs.readdir(rootDir, { recursive: true })

  return entries
    .filter((entry) => entry.endsWith('/page.tsx') || entry === 'page.tsx')
    .map((entry) => {
      const parts = entry.split('/')
      return `/${parts
        .filter((part) => {
          if (part === '[locale]') return false
          if (part.startsWith('(') && part.endsWith(')')) return false
          if (part === 'page.tsx') return false
          return true
        })
        .join('/')}`
    })
    .filter((route) => !route.includes('['))
    .filter((route) => !PROTECTED_ROUTES.includes(route))
}
