import type { SitemapItemLoose } from 'sitemap'

import { Readable } from 'node:stream'

import { createFileRoute } from '@tanstack/react-router'
import { allPages, allPosts, allProjects } from 'content-collections'
import { EnumChangefreq, ErrorLevel, SitemapStream, streamToPromise } from 'sitemap'

import { getLocalizedUrl } from '@/lib/seo'
import { locales } from '@/paraglide/runtime'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const urls: SitemapItemLoose[] = locales.flatMap((locale) =>
          [
            { pathname: '/' as const, priority: 1, frequency: EnumChangefreq.MONTHLY, updatedAt: undefined },
            ...allPages
              .filter((page) => page.locale === locale)
              .map((page) => {
                let priority = 0.5
                let frequency = EnumChangefreq.MONTHLY

                if (['about', 'blog', 'projects'].includes(page.slug)) {
                  priority = 0.8
                }

                if (['privacy', 'terms'].includes(page.slug)) {
                  priority = 0.4
                  frequency = EnumChangefreq.YEARLY
                }

                if (page.slug === 'blog') {
                  frequency = EnumChangefreq.WEEKLY
                }

                return { pathname: `/${page.slug}` as const, priority, frequency, updatedAt: page.updatedAt }
              }),
            ...allProjects
              .filter((project) => project.locale === locale)
              .map((project) => ({
                pathname: `/projects/${project.slug}` as const,
                priority: 0.6,
                frequency: EnumChangefreq.MONTHLY,
                updatedAt: project.updatedAt,
              })),
            ...allPosts
              .filter((post) => post.locale === locale)
              .map((post) => ({
                pathname: `/blog/${post.slug}` as const,
                priority: 0.6,
                frequency: EnumChangefreq.MONTHLY,
                updatedAt: post.updatedAt,
              })),
          ].map((entry) => ({
            url: getLocalizedUrl(entry.pathname, locale),
            lastmod: entry.updatedAt,
            changefreq: entry.frequency,
            priority: entry.priority,
          })),
        )

        const stream = new SitemapStream({
          level: ErrorLevel.THROW,
          xmlns: { news: false, video: false, xhtml: false, image: false },
        })

        const xml = await streamToPromise(Readable.from(urls).pipe(stream))

        return new Response(xml.toString(), {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        })
      },
    },
  },
})
