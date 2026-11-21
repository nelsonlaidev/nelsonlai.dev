import { allPages, allPosts, allProjects } from 'content-collections'
import { beforeAll, describe, expect, test } from 'vitest'

import { ENV } from '@/env'
import { getLocalizedUrl } from '@/lib/seo'
import { locales } from '@/paraglide/runtime'
import { Route } from '@/routes/sitemap[.]xml'

let entries: Element[]
let response: Response
let document: Document
beforeAll(async () => {
  const handlers = Route.options.server?.handlers
  if (!handlers || typeof handlers === 'function' || !handlers.GET) throw new Error('Expected static route handlers')
  const result = await handlers.GET({} as never)
  if (!(result instanceof Response)) throw new Error('Expected an HTTP response')
  response = result
  document = new DOMParser().parseFromString(await response.text(), 'application/xml')
  entries = [...document.querySelectorAll('url')]
})

function entryFor(path: string, locale: (typeof locales)[number]) {
  return entries.find(
    (entry) => entry.querySelector('loc')?.textContent === getLocalizedUrl(path as `/${string}`, locale),
  )
}

describe('sitemap HTTP response', () => {
  test('returns valid XML with every public content route and locale once', () => {
    expect(response.status).toBe(200)
    expect(document.querySelector('parsererror')).toBeNull()
    expect(entries).toHaveLength(locales.length + allPages.length + allPosts.length + allProjects.length)
    const urls = entries.map((entry) => entry.querySelector('loc')?.textContent)
    expect(new Set(urls).size).toBe(urls.length)
    for (const locale of locales) {
      expect(entryFor('/', locale)).toBeDefined()
      for (const [records, prefix] of [
        [allPages, ''],
        [allPosts, '/blog'],
        [allProjects, '/projects'],
      ] as const) {
        for (const record of records.filter((record) => record.locale === locale)) {
          const path = `${prefix}/${record.slug}`
          const entry = entryFor(path, locale)
          expect(entry).toBeDefined()
          const dates = [Date.parse(record.updatedAt)]
          if (path === '/blog' || path === '/projects') {
            const items = path === '/blog' ? allPosts : allProjects
            dates.push(...items.filter((item) => item.locale === locale).map((item) => Date.parse(item.updatedAt)))
          }
          expect(Date.parse(entry?.querySelector('lastmod')?.textContent ?? '')).toBe(Math.max(...dates))
        }
      }
    }
  })
  test('uses absolute URLs and the configured origin', () => {
    for (const entry of entries) {
      const url = new URL(entry.querySelector('loc')?.textContent ?? '')
      expect(url.origin).toBe(new URL(ENV.SITE_URL).origin)
    }
  })
  test('excludes protected and system routes', () => {
    for (const entry of entries)
      expect(new URL(entry.querySelector('loc')?.textContent ?? '').pathname).not.toMatch(
        /\/(?:admin|account|unsubscribe|api|og)(?:\/|$)/,
      )
  })
  test('uses valid change frequencies and bounded priorities', () => {
    for (const entry of entries) {
      expect(['weekly', 'monthly', 'yearly']).toContain(entry.querySelector('changefreq')?.textContent)
      const priority = Number(entry.querySelector('priority')?.textContent)
      expect(priority).toBeGreaterThanOrEqual(0)
      expect(priority).toBeLessThanOrEqual(1)
    }
  })
  for (const locale of locales) {
    test(`preserves priorities and update frequencies for ${locale}`, () => {
      expect(Number(entryFor('/', locale)?.querySelector('priority')?.textContent)).toBe(1)
      for (const path of ['/about', '/blog', '/projects'])
        expect(Number(entryFor(path, locale)?.querySelector('priority')?.textContent)).toBeCloseTo(0.8, 8)
      expect(entryFor('/blog', locale)?.querySelector('changefreq')?.textContent).toBe('weekly')
      for (const path of ['/privacy', '/terms']) {
        expect(entryFor(path, locale)?.querySelector('changefreq')?.textContent).toBe('yearly')
        expect(Number(entryFor(path, locale)?.querySelector('priority')?.textContent)).toBeCloseTo(0.4, 8)
      }
    })
  }
})
