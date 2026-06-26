import type { MetadataRoute } from 'next'

import { getBaseUrl } from '@/utils/get-base-url'

function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl()

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/avatar/*'],
        disallow: ['/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

export default robots
