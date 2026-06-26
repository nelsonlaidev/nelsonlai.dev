import 'server-only'

import { allPosts, allProjects, allSites } from 'content-collections'

export function getPage(slug: string, locale?: string) {
  const all = [...allSites, ...allPosts, ...allProjects]

  if (locale) {
    return all.find((entry) => entry.slug === slug && entry.locale === locale)
  }

  return all.find((entry) => entry.slug === slug)
}

export function getPosts(locale?: string) {
  if (locale) {
    return allPosts.filter((post) => post.locale === locale)
  }

  return allPosts
}

export function getPost(slug: string, locale?: string) {
  if (locale) {
    return allPosts.find((post) => post.slug === slug && post.locale === locale)
  }

  return allPosts.find((post) => post.slug === slug)
}

export function getProject(slug: string, locale?: string) {
  if (locale) {
    return allProjects.find((p) => p.slug === slug && p.locale === locale)
  }

  return allProjects.find((p) => p.slug === slug)
}

export function getSite(slug: string, locale?: string) {
  if (locale) {
    return allSites.find((p) => p.slug === slug && p.locale === locale)
  }

  return allSites.find((p) => p.slug === slug)
}

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
