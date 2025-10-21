import type { MetadataRoute } from 'next'

import { routing } from '@repo/i18n/routing'

import { getLocalizedPath } from '@/utils/get-localized-path'
import { getPathnames } from '@/utils/get-pathnames'

const sitemap = (): MetadataRoute.Sitemap => {
  const pathnames = getPathnames()

  return routing.locales.flatMap((locale) => {
    return pathnames.map((pathname) => ({
      url: getLocalizedPath({ locale, pathname }),
      lastModified: new Date()
    }))
  })
}

export default sitemap
