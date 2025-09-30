import type { MetadataRoute } from 'next'

import { routing } from '@repo/i18n/routing'

import { allPages, allPosts, allProjects } from '@/lib/content'
import { getLocalizedPath } from '@/utils/get-localized-path'

const sitemap = (): MetadataRoute.Sitemap => {
  const pathnames = [
    '',
    '/blog',
    '/guestbook',
    '/projects',
    '/dashboard',
    ...new Set(allPages.map((page) => `/${page.slug}`)),
    ...new Set(allProjects.map((project) => `/projects/${project.slug}`)),
    ...new Set(allPosts.map((post) => `/blog/${post.slug}`))
  ]

  return routing.locales.flatMap((locale) => {
    return pathnames.map((pathname) => ({
      url: getLocalizedPath({ locale, pathname }),
      lastModified: new Date()
    }))
  })
}

export default sitemap
