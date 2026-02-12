import { describe, expect, test } from 'vitest'

import sitemap from '@/app/sitemap'
import { routing } from '@/i18n/routing'
import { getLocalizedPath } from '@/utils/get-localized-path'
import { getPathnames } from '@/utils/get-pathnames'

describe(sitemap, () => {
  test('generates sitemap entries for all locales and pathnames', () => {
    expect.assertions(1)

    const pathnames = getPathnames()
    const result = sitemap()

    const expectedEntryCount = routing.locales.length * pathnames.length

    expect(result).toHaveLength(expectedEntryCount)
  })

  test('includes all required properties for each entry', () => {
    expect.hasAssertions()

    const result = sitemap()

    for (const entry of result) {
      expect(entry).toHaveProperty('url')
      expect(entry).toHaveProperty('lastModified')
      expect(entry.url).toBeTypeOf('string')
      expect(entry.lastModified).toBeInstanceOf(Date)
    }
  })

  test('generates correct URLs for each locale and pathname combination', () => {
    expect.hasAssertions()

    const pathnames = getPathnames()
    const result = sitemap()

    for (const locale of routing.locales) {
      for (const pathname of pathnames) {
        const expectedUrl = getLocalizedPath({ locale, pathname })
        const matchingEntry = result.find((entry) => entry.url === expectedUrl)

        expect(matchingEntry).toBeDefined()
        expect(matchingEntry?.url).toBe(expectedUrl)
      }
    }
  })

  test('generates URLs with correct locale prefix', () => {
    expect.hasAssertions()

    const pathnames = getPathnames()
    const result = sitemap()

    const entriesByLocale: Record<string, typeof result> = {}

    for (const locale of routing.locales) {
      entriesByLocale[locale] = []
      for (const pathname of pathnames) {
        const expectedUrl = getLocalizedPath({ locale, pathname })
        const matchingEntry = result.find((entry) => entry.url === expectedUrl)
        if (matchingEntry) {
          entriesByLocale[locale].push(matchingEntry)
        }
      }
    }

    for (const locale of routing.locales) {
      expect(entriesByLocale[locale]).toHaveLength(pathnames.length)
    }
  })

  test('covers all pathnames for each locale', () => {
    expect.hasAssertions()

    const pathnames = getPathnames()
    const result = sitemap()

    for (const locale of routing.locales) {
      const coveredPathnames = new Set<string>()

      for (const pathname of pathnames) {
        const expectedUrl = getLocalizedPath({ locale, pathname })
        const hasEntry = result.some((entry) => entry.url === expectedUrl)
        if (hasEntry) {
          coveredPathnames.add(pathname)
        }
      }

      expect(coveredPathnames.size).toBe(pathnames.length)

      for (const pathname of pathnames) {
        expect(coveredPathnames.has(pathname)).toBe(true)
      }
    }
  })

  test('generates unique URLs', () => {
    expect.assertions(1)

    const result = sitemap()
    const urls = result.map((entry) => entry.url)
    const uniqueUrls = new Set(urls)

    expect(uniqueUrls.size).toBe(urls.length)
  })

  test('uses default locale without prefix in URLs', () => {
    expect.hasAssertions()

    const pathnames = getPathnames()
    const result = sitemap()

    const defaultLocaleEntries = pathnames.map((pathname) => {
      const expectedUrl = getLocalizedPath({ locale: routing.defaultLocale, pathname })
      return result.find((entry) => entry.url === expectedUrl)
    })

    expect(defaultLocaleEntries.every((entry) => entry !== undefined)).toBe(true)
    expect(defaultLocaleEntries).toHaveLength(pathnames.length)

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
})
