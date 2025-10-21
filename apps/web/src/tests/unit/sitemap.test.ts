import { routing } from '@repo/i18n/routing'
import { describe, expect, it } from 'vitest'

import sitemap from '@/app/sitemap'
import { getLocalizedPath } from '@/utils/get-localized-path'
import { getPathnames } from '@/utils/get-pathnames'

describe('sitemap', () => {
  it('generates sitemap entries for all locales and pathnames', () => {
    const pathnames = getPathnames()
    const result = sitemap()

    const expectedEntryCount = routing.locales.length * pathnames.length
    expect(result).toHaveLength(expectedEntryCount)
  })

  it('includes all required properties for each entry', () => {
    const result = sitemap()

    for (const entry of result) {
      expect(entry).toHaveProperty('url')
      expect(entry).toHaveProperty('lastModified')
      expect(entry.url).toBeTypeOf('string')
      expect(entry.lastModified).toBeInstanceOf(Date)
    }
  })

  it('generates correct URLs for each locale and pathname combination', () => {
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

  it('generates URLs with correct locale prefix', () => {
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

  it('covers all pathnames for each locale', () => {
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

  it('generates unique URLs', () => {
    const result = sitemap()
    const urls = result.map((entry) => entry.url)
    const uniqueUrls = new Set(urls)

    expect(uniqueUrls.size).toBe(urls.length)
  })

  it('uses default locale without prefix in URLs', () => {
    const pathnames = getPathnames()
    const result = sitemap()
    const defaultLocaleEntries: typeof result = []

    for (const pathname of pathnames) {
      const expectedUrl = getLocalizedPath({ locale: routing.defaultLocale, pathname })
      const matchingEntry = result.find((entry) => entry.url === expectedUrl)
      if (matchingEntry) {
        defaultLocaleEntries.push(matchingEntry)
      }
    }

    expect(defaultLocaleEntries).toHaveLength(pathnames.length)

    for (const entry of defaultLocaleEntries) {
      for (const locale of routing.locales) {
        if (locale !== routing.defaultLocale) {
          expect(entry.url).not.toContain('/' + locale + '/')
        }
      }
    }
  })
})
