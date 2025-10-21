import 'server-only'

// eslint-disable-next-line no-restricted-imports -- This is @/lib/content
import { allPages, allPosts, allProjects } from '../../.content-collections/generated'

export const getLatestPosts = (locale: string, limit: number = allPosts.length) => {
  return allPosts
    .filter((post) => post.locale === locale)
    .toSorted((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, limit)
}

export const getLatestProjects = (locale: string, limit: number = allProjects.length) => {
  return allProjects
    .filter((project) => project.locale === locale)
    .toSorted((a, b) => {
      return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
    })
    .slice(0, limit)
}

export const getSelectedProjects = (locale: string) => {
  return allProjects.filter((project) => project.selected && project.locale === locale)
}

export const getPostBySlug = (locale: string, slug: string) => {
  return allPosts.find((p) => p.slug === slug && p.locale === locale)
}

export const getProjectBySlug = (locale: string, slug: string) => {
  return allProjects.find((p) => p.slug === slug && p.locale === locale)
}

export const getPageBySlug = (locale: string, slug: string) => {
  return allPages.find((p) => p.slug === slug && p.locale === locale)
}

// eslint-disable-next-line no-restricted-imports -- This is @/lib/content
export * from '../../.content-collections/generated'
