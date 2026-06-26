import type { MetadataRoute } from 'next'
import type { PathnameEntry } from '@/utils/get-pathnames'

import { routing } from '@/i18n/routing'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'
import { getPathnames } from '@/utils/get-pathnames'

function getPriority(entry: PathnameEntry): number {
  if (entry.pathname === '/') return 1
  if (entry.type === 'post') return 0.6
  if (entry.type === 'project') return 0.6
  if (entry.pathname === '/about' || entry.pathname === '/blog' || entry.pathname === '/projects') return 0.8
  if (entry.pathname === '/privacy' || entry.pathname === '/terms') return 0.4
  return 0.5
}

function getChangeFrequency(entry: PathnameEntry): 'weekly' | 'monthly' | 'yearly' {
  if (entry.pathname === '/blog') return 'weekly'
  if (entry.pathname === '/privacy' || entry.pathname === '/terms') return 'yearly'
  return 'monthly'
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl()
  const entries = getPathnames()

  return routing.locales.flatMap((locale) =>
    entries.map((entry) => ({
      url: `${baseUrl}${getLocalizedPath(entry.pathname, locale)}`,
      lastModified: new Date(entry.lastModified),
      changeFrequency: getChangeFrequency(entry),
      priority: getPriority(entry),
    })),
  )
}
