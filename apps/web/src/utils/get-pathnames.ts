import { allPages, allPosts, allProjects } from '@/lib/content'

export const PROTECTED_ROUTES = ['/admin', '/account', '/account/settings']

type GetPathnamesOptions = {
  includeProtectedRoutes?: boolean
}

export const getPathnames = (options: GetPathnamesOptions = {}) => {
  const { includeProtectedRoutes = false } = options

  const publicRoutes = [
    '/',
    '/blog',
    '/guestbook',
    '/projects',
    '/dashboard',
    ...new Set(allPages.map((page) => `/${page.slug}`)),
    ...new Set(allProjects.map((project) => `/projects/${project.slug}`)),
    ...new Set(allPosts.map((post) => `/blog/${post.slug}`))
  ]

  if (includeProtectedRoutes) {
    return [...publicRoutes, ...PROTECTED_ROUTES]
  }

  return publicRoutes
}
