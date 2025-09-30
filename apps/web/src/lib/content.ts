import type { Locale } from 'next-intl'

import 'server-only'

import { allPages, allPosts, allProjects } from '../../.content-collections/generated'

export const getLatestPosts = (locale: Locale, limit: number = allPosts.length) => {
  return allPosts
    .filter((post) => post.locale === locale)
    .toSorted((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, limit)
}

export const getLatestProjects = (locale: Locale, limit: number = allProjects.length) => {
  return allProjects
    .filter((project) => project.locale === locale)
    .toSorted((a, b) => {
      return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
    })
    .slice(0, limit)
}

export const getSelectedProjects = (locale: Locale) => {
  return allProjects.filter((project) => project.selected && project.locale === locale)
}

export const getPostBySlug = (locale: Locale, slug: string) => {
  return allPosts.find((p) => p.slug === slug && p.locale === locale)
}

export const getProjectBySlug = (locale: Locale, slug: string) => {
  return allProjects.find((p) => p.slug === slug && p.locale === locale)
}

export const getPageBySlug = (locale: Locale, slug: string) => {
  return allPages.find((p) => p.slug === slug && p.locale === locale)
}

export * from '../../.content-collections/generated'
