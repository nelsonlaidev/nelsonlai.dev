import { createFileRoute } from '@tanstack/react-router'
import RSS from 'rss'

import { ENV } from '@/env'
import { listPosts } from '@/features/posts/posts.server'
import { getLocalizedUrl } from '@/lib/seo'
import { SITE } from '@/lib/site'
import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'

export const Route = createFileRoute('/rss.xml')({
  server: {
    handlers: {
      GET: () => {
        const locale = getLocale()

        const feed = new RSS({
          title: SITE.name,
          description: m.metadata_site_description({}, { locale }),
          site_url: getLocalizedUrl('/', locale),
          feed_url: getLocalizedUrl('/rss.xml', locale),
          language: locale,
          image_url: new URL('/favicon-96x96.png', ENV.SITE_URL).href,
          copyright: `© ${new Date().getFullYear()} ${SITE.name}. All rights reserved.`,
          webMaster: SITE.email,
        })

        for (const post of listPosts(locale)) {
          feed.item({
            title: post.title,
            url: getLocalizedUrl(`/blog/${post.slug}`, locale),
            date: post.publishedAt,
            description: post.description,
            author: SITE.name,
          })
        }

        return new Response(feed.xml({ indent: true }), {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
            Vary: 'Accept-Language, Cookie',
          },
        })
      },
    },
  },
})
