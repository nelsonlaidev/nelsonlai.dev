import { createFileRoute } from '@tanstack/react-router'
import { allPages, allPosts, allProjects } from 'content-collections'

import { getLocalizedUrl } from '@/lib/seo'
import { locales } from '@/paraglide/runtime'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () => {
        const urls = locales.flatMap((locale) =>
          [
            { pathname: '/' as const, priority: 1, frequency: 'monthly', updatedAt: undefined },
            ...allPages
              .filter((page) => page.locale === locale)
              .map((page) => {
                let priority = 0.5
                let frequency = 'monthly'
                if (['about', 'blog', 'projects'].includes(page.slug)) priority = 0.8
                if (['privacy', 'terms'].includes(page.slug)) {
                  priority = 0.4
                  frequency = 'yearly'
                }
                if (page.slug === 'blog') frequency = 'weekly'
                return { pathname: `/${page.slug}` as const, priority, frequency, updatedAt: page.updatedAt }
              }),
            ...allProjects
              .filter((project) => project.locale === locale)
              .map((project) => ({
                pathname: `/projects/${project.slug}` as const,
                priority: 0.6,
                frequency: 'monthly',
                updatedAt: project.updatedAt,
              })),
            ...allPosts
              .filter((post) => post.locale === locale)
              .map((post) => ({
                pathname: `/blog/${post.slug}` as const,
                priority: 0.6,
                frequency: 'monthly',
                updatedAt: post.updatedAt,
              })),
          ].map((entry) => {
            const lastModified = entry.updatedAt ? `<lastmod>${entry.updatedAt}</lastmod>` : ''
            return `<url><loc>${getLocalizedUrl(entry.pathname, locale)}</loc>${lastModified}<changefreq>${entry.frequency}</changefreq><priority>${entry.priority}</priority></url>`
          }),
        )
        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('\n')}</urlset>`,
          { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } },
        )
      },
    },
  },
})
