import type { ProjectSummary } from './projects'

import { allProjects } from 'content-collections'

export function listProjects(locale: string, limit: number | null = null, selectedOnly = false): ProjectSummary[] {
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
