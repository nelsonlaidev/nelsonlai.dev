import type { Locale } from '@/paraglide/runtime'
import type { ProjectSummary } from './types'

import { allProjects } from 'content-collections'

export function findProject(slug: string, locale: Locale) {
  const project = allProjects.find((project) => project.slug === slug && project.locale === locale)

  if (!project) return null

  return {
    slug: project.slug,
    title: project.title,
    description: project.description,
    homepage: project.homepage,
    github: project.github,
    dateCreated: project.dateCreated,
    updatedAt: project.updatedAt,
    mdx: project.mdx,
  }
}

export function listProjects(locale: Locale, limit: number | null = null, selectedOnly = false): ProjectSummary[] {
  return allProjects
    .filter((project) => project.locale === locale && (!selectedOnly || project.selected))
    .toSorted((a, b) => b.dateCreated.localeCompare(a.dateCreated))
    .slice(0, limit ?? undefined)
    .map((project) => ({
      title: project.title,
      description: project.description,
      slug: project.slug,
      techstack: project.techstack,
    }))
}
