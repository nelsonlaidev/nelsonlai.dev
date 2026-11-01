import type { ProjectSummary } from './types'

// Stable specimen identities keep artwork and numbering consistent across filters and pages.
const PROJECT_SPECIMENS: Record<
  string,
  {
    art: string
    category: 'developer' | 'personal' | 'publishing'
    number: number
  }
> = {
  uprest: { art: 'pearl', category: 'developer', number: 1 },
  scoutly: { art: 'blue', category: 'developer', number: 2 },
  links: { art: 'coral', category: 'personal', number: 3 },
  'zsh-web': { art: 'terminal', category: 'personal', number: 4 },
  'one-blog': { art: 'pages', category: 'publishing', number: 5 },
  tools: { art: 'tools', category: 'developer', number: 6 },
  blog: { art: 'journal', category: 'publishing', number: 7 },
}

export function projectSpecimen(slug: string) {
  return PROJECT_SPECIMENS[slug] ?? { art: 'pearl', category: 'personal', number: 8 }
}

export function orderProjectSpecimens<T extends Pick<ProjectSummary, 'slug'>>(projects: T[]) {
  return projects.toSorted((a, b) => projectSpecimen(a.slug).number - projectSpecimen(b.slug).number)
}
