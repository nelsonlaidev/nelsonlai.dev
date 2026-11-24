import { allPages, allPosts, allProjects } from 'content-collections'
import { SyntaxValidator } from 'fast-xml-validator'
import { create } from 'xmlbuilder2'

import { ENV } from '@/env'
import { getLocalizedUrl } from '@/lib/seo'
import { locales } from '@/paraglide/runtime'

import { expect, test } from '../fixtures/test'

test('serves a sitemap with every public URL and its metadata', async ({ request }) => {
  const response = await request.get('/sitemap.xml', { maxRedirects: 0 })
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toMatch(/^application\/xml\b/i)

  const xml = await response.text()
  expect(SyntaxValidator.validate(xml)).toBe(true)
  const root = create(xml).root()
  expect(root.node.nodeName).toBe('urlset')

  const urls = root.filter((child) => child.node.nodeName === 'url')
  const entries = new Map(
    urls.map((url) => {
      const fields = new Map(url.map((field) => [field.node.nodeName, field.node.textContent] as const))
      return [
        fields.get('loc'),
        {
          lastmod: Date.parse(fields.get('lastmod') ?? ''),
          priority: Number(fields.get('priority')),
          frequency: fields.get('changefreq'),
        },
      ] as const
    }),
  )
  expect(urls).toHaveLength(locales.length + allPages.length + allPosts.length + allProjects.length)
  expect(entries.size).toBe(urls.length)

  for (const [location, entry] of entries) {
    const url = new URL(location ?? '')
    expect(url.origin).toBe(new URL(ENV.SITE_URL).origin)
    expect(url.pathname).not.toMatch(/\/(?:admin|account|unsubscribe|api|og)(?:\/|$)/)
    expect(['weekly', 'monthly', 'yearly']).toContain(entry.frequency)
    expect(entry.priority).toBeGreaterThanOrEqual(0)
    expect(entry.priority).toBeLessThanOrEqual(1)
  }

  for (const locale of locales) {
    expect(entries.get(getLocalizedUrl('/', locale))?.priority).toBe(1)
    for (const path of ['/about', '/blog', '/projects'] as const)
      expect(entries.get(getLocalizedUrl(path, locale))?.priority).toBeCloseTo(0.8, 8)
    expect(entries.get(getLocalizedUrl('/blog', locale))?.frequency).toBe('weekly')
    for (const path of ['/privacy', '/terms'] as const)
      expect(entries.get(getLocalizedUrl(path, locale))).toMatchObject({ priority: 0.4, frequency: 'yearly' })

    const indexUpdates = new Map([
      ['/blog', allPosts.filter((post) => post.locale === locale).map((post) => Date.parse(post.updatedAt))],
      [
        '/projects',
        allProjects.filter((project) => project.locale === locale).map((project) => Date.parse(project.updatedAt)),
      ],
    ])
    for (const [records, prefix] of [
      [allPages, ''],
      [allPosts, '/blog'],
      [allProjects, '/projects'],
    ] as const) {
      for (const record of records.filter((item) => item.locale === locale)) {
        const path = `${prefix}/${record.slug}` as const
        const url = getLocalizedUrl(path, locale)
        expect(entries.get(url)?.lastmod, url).toBe(
          Math.max(Date.parse(record.updatedAt), ...(indexUpdates.get(path) ?? [])),
        )
      }
    }
  }
})
