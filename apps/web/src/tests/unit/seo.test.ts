import { describe, expect, test } from 'vitest'

import { ENV } from '@/env'
import { createPrivateSeoHead, createSeoHead } from '@/lib/seo'

describe('sharing metadata', () => {
  test('publishes the home sharing image and its dimensions', () => {
    const head = createSeoHead({ pathname: '/', locale: 'en', title: null, description: 'Home' })
    const image = new URL('/og/image.webp', ENV.SITE_URL).href

    expect(head.meta).toContainEqual({ property: 'og:image', content: image })
    expect(head.meta).toContainEqual({ name: 'twitter:image', content: image })
    expect(head.meta).toContainEqual({ property: 'og:image:type', content: 'image/webp' })
    expect(head.meta).toContainEqual({ property: 'og:image:width', content: '1200' })
    expect(head.meta).toContainEqual({ property: 'og:image:height', content: '630' })
    expect(head.links).toContainEqual({ rel: 'canonical', href: new URL('/', ENV.SITE_URL).href })
  })

  test('localizes sharing and canonical URLs for nested pages', () => {
    const head = createSeoHead({ pathname: '/blog/php', locale: 'zh-TW', title: 'PHP', description: 'PHP' })
    const image = new URL('/zh-TW/og/blog/php/image.webp', ENV.SITE_URL).href

    expect(head.meta).toContainEqual({ property: 'og:image', content: image })
    expect(head.meta).toContainEqual({ name: 'twitter:image', content: image })
    expect(head.links).toContainEqual({ rel: 'canonical', href: new URL('/zh-TW/blog/php', ENV.SITE_URL).href })
  })

  test('private pages retain noindex and do not advertise private sharing images', () => {
    for (const pathname of ['/account', '/admin'] as const) {
      const head = createPrivateSeoHead({ title: 'Private', description: 'Private', pathname, locale: 'en' })

      expect(head.meta).toContainEqual({ name: 'robots', content: 'noindex, nofollow' })
      expect(head.meta.some((meta) => 'property' in meta && meta.property === 'og:image')).toBe(false)
    }
  })
})
