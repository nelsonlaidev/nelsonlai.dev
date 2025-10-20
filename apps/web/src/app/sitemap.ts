import type { MetadataRoute } from 'next'

import { routing } from '@repo/i18n/routing'

import { pathnames } from '@/lib/pathnames'
import { getLocalizedPath } from '@/utils/get-localized-path'

const sitemap = (): MetadataRoute.Sitemap => {
  return routing.locales.flatMap((locale) => {
    return pathnames.map((pathname) => ({
      url: getLocalizedPath({ locale, pathname }),
      lastModified: new Date()
    }))
  })
}

export default sitemap
