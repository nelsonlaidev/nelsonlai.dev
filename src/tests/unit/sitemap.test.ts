import { describe, expect, test } from 'vitest'

import sitemap from '@/app/sitemap'
import { routing } from '@/i18n/routing'
import { getLocalizedPath } from '@/utils/get-localized-path'
import { getPathnames } from '@/utils/get-pathnames'

describe(sitemap, () => {
  test('generates sitemap entries for all locales and pathnames', () => {
    const pathnames = getPathnames()
    const result = sitemap()

    const expectedEntryCount = routing.locales.length * pathnames.length
    expect(result).toHaveLength(expectedEntryCount)
  })

  test('includes all required properties for each entry', () => {
    const result = sitemap()

    const allHaveUrl = result.every((entry) => 'url' in entry)
    const allHaveLastModified = result.every((entry) => 'lastModified' in entry)
    const allUrlsAreStrings = result.every((entry) => typeof entry.url === 'string')
    const allLastModifiedAreDates = result.every((entry) => entry.lastModified instanceof Date)

    expect(allHaveUrl).toBeTruthy()
    expect(allHaveLastModified).toBeTruthy()
    expect(allUrlsAreStrings).toBeTruthy()
    expect(allLastModifiedAreDates).toBeTruthy()
  })

  describe('generates correct URLs for each locale and pathname combination', () => {
    const pathnames = getPathnames()
    const localePathnamesCombinations = routing.locales.flatMap((locale) =>
      pathnames.map((pathname) => ({ locale, pathname })),
    )

    test.each(localePathnamesCombinations)('$locale - $pathname', ({ locale, pathname }) => {
      const result = sitemap()
      const expectedUrl = getLocalizedPath({ locale, pathname })
      const matchingEntry = result.find((entry) => entry.url === expectedUrl)

      expect(matchingEntry).toBeDefined()
      expect(matchingEntry?.url).toBe(expectedUrl)
    })
  })

  describe('generates URLs with correct locale prefix', () => {
    test.each(routing.locales)('%s has entries for all pathnames', (locale) => {
      const pathnames = getPathnames()
      const result = sitemap()

      const localeEntries = pathnames
        .map((pathname) => {
          const expectedUrl = getLocalizedPath({ locale, pathname })
          return result.find((entry) => entry.url === expectedUrl)
        })
        .filter((entry): entry is NonNullable<typeof entry> => entry !== undefined)

      expect(localeEntries).toHaveLength(pathnames.length)
    })
  })

  describe('covers all pathnames for each locale', () => {
    test.each(routing.locales)('%s covers all pathnames', (locale) => {
      const pathnames = getPathnames()
      const result = sitemap()

      const expectedUrls = pathnames.map((pathname) => getLocalizedPath({ locale, pathname }))
      const actualUrls = result.map((entry) => entry.url)

      expect(actualUrls).toStrictEqual(expect.arrayContaining(expectedUrls))

      const coveredPathnamesCount = pathnames.filter((pathname) => {
        const expectedUrl = getLocalizedPath({ locale, pathname })
        return result.some((entry) => entry.url === expectedUrl)
      }).length

      expect(coveredPathnamesCount).toBe(pathnames.length)
    })
  })

  test('generates unique URLs', () => {
    const result = sitemap()
    const urls = result.map((entry) => entry.url)
    const uniqueUrls = new Set(urls)

    expect(uniqueUrls.size).toBe(urls.length)
  })

  test('uses default locale without prefix in URLs', () => {
    const pathnames = getPathnames()
    const result = sitemap()

    const defaultLocaleEntries = pathnames
      .map((pathname) => {
        const expectedUrl = getLocalizedPath({ locale: routing.defaultLocale, pathname })
        return result.find((entry) => entry.url === expectedUrl)
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== undefined)

    expect(defaultLocaleEntries).toHaveLength(pathnames.length)

    const nonDefaultLocales = routing.locales.filter((locale) => locale !== routing.defaultLocale)
    const nonDefaultLocalePatterns = nonDefaultLocales.map((locale) => `/${locale}/`)

    const allDefaultEntriesDoNotContainNonDefaultLocales = defaultLocaleEntries.every((entry) =>
      nonDefaultLocalePatterns.every((pattern) => !entry.url.includes(pattern)),
    )

    expect(allDefaultEntriesDoNotContainNonDefaultLocales).toBeTruthy()
  })
})
