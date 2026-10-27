import { createFileRoute } from '@tanstack/react-router'

import { ENV } from '@/env'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(
          `User-agent: *\nAllow: /\nAllow: /api/avatar/*\nAllow: /api/image\nDisallow: /api/\n\nSitemap: ${ENV.SITE_URL}/sitemap.xml\n`,
          { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } },
        ),
    },
  },
})
