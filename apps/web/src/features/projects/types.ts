import type { Project } from 'content-collections'

export type ProjectSummary = Pick<
  Project,
  'slug' | 'artwork' | 'title' | 'description' | 'techstack' | 'schemaType' | 'dateCreated'
>
