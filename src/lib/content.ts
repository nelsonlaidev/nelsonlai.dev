import 'server-only'

import { allPages, allPosts, allProjects } from 'content-collections'

export function getLatestPosts(locale: string, limit: number = allPosts.length) {
  return allPosts
    .filter((post) => post.locale === locale)
    .toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

export function getLatestProjects(locale: string, limit: number = allProjects.length) {
  return allProjects
    .filter((project) => project.locale === locale)
    .toSorted((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())
    .slice(0, limit)
}

export function getSelectedProjects(locale: string) {
  return allProjects.filter((project) => project.selected && project.locale === locale)
}

export function getPostBySlug(locale: string, slug: string) {
  return allPosts.find((p) => p.slug === slug && p.locale === locale)
}

export function getProjectBySlug(locale: string, slug: string) {
  return allProjects.find((p) => p.slug === slug && p.locale === locale)
}

export function getPageBySlug(locale: string, slug: string) {
  return allPages.find((p) => p.slug === slug && p.locale === locale)
}
