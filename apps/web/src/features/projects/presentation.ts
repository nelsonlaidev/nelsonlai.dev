// Stable specimen identities keep artwork and numbering consistent across filters and pages.
const specimens: Record<string, { art: string; category: 'developer' | 'personal' | 'publishing'; number: number }> = {
  uprest: { art: 'pearl', category: 'developer', number: 1 },
  scoutly: { art: 'blue', category: 'developer', number: 2 },
  links: { art: 'coral', category: 'personal', number: 3 },
  'zsh-web': { art: 'terminal', category: 'personal', number: 4 },
  'one-blog': { art: 'pages', category: 'publishing', number: 5 },
  tools: { art: 'tools', category: 'developer', number: 6 },
  blog: { art: 'journal', category: 'publishing', number: 7 },
}

export function projectSpecimen(slug: string) {
  return specimens[slug] ?? { art: 'pearl', category: 'personal', number: 8 }
}

export function orderProjectSpecimens<T extends { slug: string }>(projects: T[]) {
  return projects.toSorted((a, b) => projectSpecimen(a.slug).number - projectSpecimen(b.slug).number)
}
