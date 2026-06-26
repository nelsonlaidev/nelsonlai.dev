import type { Locale } from 'next-intl'

import { describe, expect, test } from 'vitest'

import sitemap from '@/app/sitemap'
import { routing } from '@/i18n/routing'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'
import { getPathnames } from '@/utils/get-pathnames'

function absoluteUrl(locale: Locale, pathname: string) {
  const baseUrl = getBaseUrl()

  return `${baseUrl}${getLocalizedPath(pathname, locale)}`
}

describe('sitemap', () => {
  test('generates sitemap entries for all locales and pathnames', () => {
    expect.assertions(1)

    const entries = getPathnames()
    const result = sitemap()

    const expectedEntryCount = routing.locales.length * entries.length

    expect(result).toHaveLength(expectedEntryCount)
  })

  test('includes all required properties for each entry', () => {
    expect.hasAssertions()

    const result = sitemap()

    for (const entry of result) {
      expect(entry).toHaveProperty('url')
      expect(entry).toHaveProperty('lastModified')
      expect(entry).toHaveProperty('changeFrequency')
      expect(entry).toHaveProperty('priority')
      expect(entry.url).toBeTypeOf('string')
      expect(entry.lastModified).toBeInstanceOf(Date)
      expect(entry.changeFrequency).toBeTypeOf('string')
      expect(entry.priority).toBeTypeOf('number')
    }
  })

  test('generates correct URLs for each locale and pathname combination', () => {
    expect.hasAssertions()

    const entries = getPathnames()
    const result = sitemap()

    for (const locale of routing.locales) {
      for (const entry of entries) {
        const expectedUrl = absoluteUrl(locale, entry.pathname)
        const matchingEntry = result.find((e) => e.url === expectedUrl)

        expect(matchingEntry).toBeDefined()
        expect(matchingEntry?.url).toBe(expectedUrl)
      }
    }
  })

  test('generates URLs with correct locale prefix', () => {
    expect.hasAssertions()

    const entries = getPathnames()
    const result = sitemap()

    const entriesByLocale: Record<string, typeof result> = {}

    for (const locale of routing.locales) {
      entriesByLocale[locale] = []
      for (const entry of entries) {
        const expectedUrl = absoluteUrl(locale, entry.pathname)
        const matchingEntry = result.find((e) => e.url === expectedUrl)
        if (matchingEntry) {
          entriesByLocale[locale].push(matchingEntry)
        }
      }
    }

    for (const locale of routing.locales) {
      expect(entriesByLocale[locale]).toHaveLength(entries.length)
    }
  })

  test('covers all pathnames for each locale', () => {
    expect.hasAssertions()

    const entries = getPathnames()
    const result = sitemap()

    for (const locale of routing.locales) {
      const coveredPathnames = new Set<string>()

      for (const entry of entries) {
        const expectedUrl = absoluteUrl(locale, entry.pathname)
        const hasEntry = result.some((e) => e.url === expectedUrl)
        if (hasEntry) {
          coveredPathnames.add(entry.pathname)
        }
      }

      expect(coveredPathnames.size).toBe(entries.length)

      for (const entry of entries) {
        expect(coveredPathnames.has(entry.pathname)).toBe(true)
      }
    }
  })

  test('generates unique URLs', () => {
    expect.assertions(1)

    const result = sitemap()
    const urls = result.map((e) => e.url)
    const uniqueUrls = new Set(urls)

    expect(uniqueUrls.size).toBe(urls.length)
  })

  test('uses default locale without prefix in URLs', () => {
    expect.hasAssertions()

    const entries = getPathnames()
    const result = sitemap()

    const defaultLocaleEntries = entries.map((entry) => {
      const expectedUrl = absoluteUrl(routing.defaultLocale, entry.pathname)
      return result.find((e) => e.url === expectedUrl)
    })

    expect(defaultLocaleEntries.every((e) => e !== undefined)).toBe(true)
    expect(defaultLocaleEntries).toHaveLength(entries.length)

    const allDefaultEntries = defaultLocaleEntries.filter(
      (entry): entry is NonNullable<typeof entry> => entry !== undefined,
    )

    const nonDefaultLocales = routing.locales.filter((locale) => locale !== routing.defaultLocale)

    for (const entry of allDefaultEntries) {
      for (const locale of nonDefaultLocales) {
        expect(entry.url).not.toContain(`/${locale}/`)
      }
    }
  })

  test('assigns weekly changeFrequency to blog index', () => {
    expect.hasAssertions()

    const result = sitemap()
    const baseUrl = getBaseUrl()

    const blogIndexEntries = result.filter((e) => {
      const path = e.url.slice(baseUrl.length)
      return path === '/blog' || /^\/[a-z]{2}(?:-[A-Z]{2})?\/blog$/.test(path)
    })

    expect(blogIndexEntries.length).toBeGreaterThan(0)

    for (const entry of blogIndexEntries) {
      expect(entry.changeFrequency).toBe('weekly')
    }
  })

  test('assigns yearly changeFrequency to legal pages', () => {
    expect.hasAssertions()

    const result = sitemap()
    const baseUrl = getBaseUrl()

    const legalEntries = result.filter((e) => {
      const path = e.url.slice(baseUrl.length)
      return path === '/privacy' || path === '/terms' || /^\/[a-z]{2}(?:-[A-Z]{2})?\/(?:privacy|terms)$/.test(path)
    })

    expect(legalEntries.length).toBeGreaterThan(0)

    for (const entry of legalEntries) {
      expect(entry.changeFrequency).toBe('yearly')
    }
  })

  test('assigns valid changeFrequency values', () => {
    expect.hasAssertions()

    const validFrequencies = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']
    const result = sitemap()

    for (const entry of result) {
      expect(validFrequencies).toContain(entry.changeFrequency)
    }
  })

  test('assigns correct priority to homepage', () => {
    expect.hasAssertions()

    const result = sitemap()
    const baseUrl = getBaseUrl()

    const homepageEntries = result.filter((e) => e.url === `${baseUrl}/`)

    expect(homepageEntries.length).toBeGreaterThan(0)

    for (const entry of homepageEntries) {
      expect(entry.priority).toBe(1)
    }
  })

  test('assigns priority between 0 and 1 to all entries', () => {
    expect.hasAssertions()

    const result = sitemap()

    for (const entry of result) {
      expect(entry.priority).toBeGreaterThanOrEqual(0)
      expect(entry.priority).toBeLessThanOrEqual(1)
    }
  })

  test('uses actual lastModified from content instead of current time', () => {
    expect.hasAssertions()

    const now = Date.now()
    const result = sitemap()

    const blogEntries = result.filter((e) => e.url.includes('/blog/') && !e.url.endsWith('/blog'))

    expect(blogEntries.length).toBeGreaterThan(0)

    for (const entry of blogEntries) {
      const modified = entry.lastModified as Date
      expect(modified.getTime()).toBeLessThan(now)
    }
  })
})
