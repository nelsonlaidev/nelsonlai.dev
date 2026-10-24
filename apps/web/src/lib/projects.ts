import type { Project } from 'content-collections'

export type ProjectSummary = Pick<Project, 'slug' | 'title' | 'description' | 'techstack'>
