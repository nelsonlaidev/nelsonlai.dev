import { allPosts, allProjects, allSites } from 'content-collections'

export const PROTECTED_ROUTES = ['/admin', '/account', '/account/settings']

export type PathnameEntry = {
  pathname: string
  type: 'page' | 'post' | 'project'
  lastModified: string
}

type GetPathnamesOptions = {
  includeProtectedRoutes?: boolean
}

export function getPathnames(options: GetPathnamesOptions = {}) {
  const { includeProtectedRoutes = false } = options

  const now = new Date().toISOString()

  const entryMap = new Map<string, PathnameEntry>([['/', { pathname: '/', type: 'page', lastModified: now }]])

  for (const site of allSites) {
    const pathname = `/${site.slug}`
    if (!entryMap.has(pathname)) {
      entryMap.set(pathname, { pathname, type: 'page', lastModified: site.lastModified })
    }
  }

  for (const project of allProjects) {
    const pathname = `/projects/${project.slug}`
    if (!entryMap.has(pathname)) {
      entryMap.set(pathname, { pathname, type: 'project', lastModified: project.lastModified })
    }
  }

  for (const post of allPosts) {
    const pathname = `/blog/${post.slug}`
    if (!entryMap.has(pathname)) {
      entryMap.set(pathname, { pathname, type: 'post', lastModified: post.lastModified })
    }
  }

  if (includeProtectedRoutes) {
    for (const route of PROTECTED_ROUTES) {
      if (!entryMap.has(route)) {
        entryMap.set(route, { pathname: route, type: 'page', lastModified: now })
      }
    }
  }

  return [...entryMap.values()]
}
