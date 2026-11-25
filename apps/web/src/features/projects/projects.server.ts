import type { Locale } from '@/paraglide/runtime'
import type { ProjectSummary } from './types'

import { allProjects } from 'content-collections'

export function findProject(slug: string, locale: Locale) {
  const project = allProjects.find((project) => project.slug === slug && project.locale === locale)

  if (!project) return null

  return {
    code: project.code,
    slug: project.slug,
    locale,
    title: project.title,
    description: project.description,
    artwork: project.artwork,
    techstack: project.techstack,
    category: project.category,
    features: project.features,
    homepage: project.homepage,
    github: project.github,
    schemaType: project.schemaType,
    license: project.license,
    programmingLanguages: project.programmingLanguages,
    dateCreated: project.dateCreated,
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
      artwork: project.artwork,
      techstack: project.techstack,
      schemaType: project.schemaType,
      dateCreated: project.dateCreated,
    }))
}
