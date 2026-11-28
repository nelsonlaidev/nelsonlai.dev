import { createFileRoute } from '@tanstack/react-router'

import { ENV } from '@/env'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () => {
        const robots = [
          'User-agent: *',
          'Allow: /',
          'Allow: /api/avatar/*',
          'Disallow: /api/',
          'Disallow: /_serverFn/',
          '',
          `Sitemap: ${ENV.SITE_URL}/sitemap.xml`,
        ].join('\n')

        return new Response(robots, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        })
      },
    },
  },
})
