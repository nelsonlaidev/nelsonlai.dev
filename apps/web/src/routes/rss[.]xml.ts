import { createFileRoute } from '@tanstack/react-router'
import { create } from 'xmlbuilder2'

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
        const posts = listPosts(locale)
        const siteUrl = getLocalizedUrl('/', locale)
        const channel = create({ version: '1.0', encoding: 'utf-8' })
          .ele('rss', {
            version: '2.0',
            'xmlns:atom': 'http://www.w3.org/2005/Atom',
            'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
          })
          .ele('channel')

        channel.ele({
          title: SITE.name,
          description: m.metadata_site_description({}, { locale }),
          link: siteUrl,
          language: locale,
          'atom:link': { '@href': getLocalizedUrl('/rss.xml', locale), '@rel': 'self', '@type': 'application/rss+xml' },
          image: { url: new URL('/favicon-96x96.png', ENV.SITE_URL).href, title: SITE.name, link: siteUrl },
          copyright: `© ${new Date().getFullYear()} ${SITE.name}. All rights reserved.`,
          webMaster: SITE.email,
        })

        if (posts.length > 0) {
          const latestUpdate = Math.max(...posts.map((post) => Date.parse(post.updatedAt)))
          channel.ele('lastBuildDate').txt(new Date(latestUpdate).toUTCString())
        }

        for (const post of posts) {
          const link = getLocalizedUrl(`/blog/${post.slug}`, locale)

          channel.ele('item').ele({
            title: post.title,
            description: post.description,
            link,
            guid: { '@isPermaLink': 'true', '#': link },
            'dc:creator': SITE.name,
            pubDate: new Date(post.publishedAt).toUTCString(),
          })
        }

        return new Response(channel.end({ prettyPrint: true }), {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        })
      },
    },
  },
})
