import { allPages, allPosts, allProjects } from 'content-collections'
import { describe, expect, test } from 'vitest'

import { ENV } from '@/env'
import { createPrivateSeoHead, createSeoHead, getLocalizedUrl } from '@/lib/seo'
import { locales } from '@/paraglide/runtime'

describe('sharing metadata', () => {
  for (const locale of locales) {
    test(`maps every public ${locale} page to the existing localized dynamic image route`, () => {
      const records = [
        { pathname: '/' as const, title: null, description: 'Home' },
        ...allPages
          .filter((page) => page.locale === locale)
          .map((page) => ({ ...page, pathname: `/${page.slug}` as const })),
        ...allPosts
          .filter((post) => post.locale === locale)
          .map((post) => ({ ...post, pathname: `/blog/${post.slug}` as const })),
        ...allProjects
          .filter((project) => project.locale === locale)
          .map((project) => ({ ...project, pathname: `/projects/${project.slug}` as const })),
      ]
      for (const record of records) {
        const head = createSeoHead({ ...record, locale })
        const image = getLocalizedUrl(`/og${record.pathname === '/' ? '' : record.pathname}/image.webp`, locale)
        expect(head.meta).toContainEqual({ property: 'og:image', content: image })
        expect(head.meta).toContainEqual({ name: 'twitter:image', content: image })
        expect(head.meta).toContainEqual({ property: 'og:image:type', content: 'image/webp' })
        expect(head.meta).toContainEqual({ property: 'og:image:width', content: '1200' })
        expect(head.meta).toContainEqual({ property: 'og:image:height', content: '630' })
        expect(new URL(image).origin).toBe(new URL(ENV.SITE_URL).origin)
        expect(head.links).toContainEqual({ rel: 'canonical', href: getLocalizedUrl(record.pathname, locale) })
      }
    })
  }

  test('private pages retain noindex and do not advertise private sharing images', () => {
    for (const pathname of ['/account', '/admin'] as const) {
      const head = createPrivateSeoHead({ title: 'Private', description: 'Private', pathname, locale: 'en' })
      expect(head.meta).toContainEqual({ name: 'robots', content: 'noindex, nofollow' })
      expect(head.meta.some((meta) => 'property' in meta && meta.property === 'og:image')).toBe(false)
    }
  })
})
