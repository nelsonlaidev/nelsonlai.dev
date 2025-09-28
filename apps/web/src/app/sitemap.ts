import type { MetadataRoute } from 'next'

import { supportedLanguages } from '@repo/i18n/config'

import { allPages, allPosts, allProjects } from '@/lib/content'
import { getLocalizedPath } from '@/utils/get-localized-path'

const sitemap = (): MetadataRoute.Sitemap => {
  const pathnames = [
    '',
    '/blog',
    '/guestbook',
    '/projects',
    '/dashboard',
    ...new Set(allPages.map((page) => page.pathname)),
    ...new Set(allProjects.map((project) => project.pathname)),
    ...new Set(allPosts.map((post) => post.pathname))
  ]

  return supportedLanguages.flatMap((locale) => {
    return pathnames.map((pathname) => ({
      url: getLocalizedPath({ locale: locale.code, pathname }),
      lastModified: new Date()
    }))
  })
}

export default sitemap
