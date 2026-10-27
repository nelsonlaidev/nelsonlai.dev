import { createServerFn } from '@tanstack/react-start'
import * as z from 'zod'

import { locales } from '@/paraglide/runtime'

import { findProject, listProjects } from './projects.server'

export const getProject = createServerFn({ method: 'GET' })
  .validator(z.object({ slug: z.string().min(1), locale: z.enum(locales) }))
  .handler(({ data }) => {
    return findProject(data.slug, data.locale)
  })

export const getProjects = createServerFn({ method: 'GET' })
  .validator(
    z.object({
      locale: z.enum(locales),
      limit: z.number().int().min(1).max(50).nullable().default(null),
      selectedOnly: z.boolean().default(false),
    }),
  )
  .handler(({ data }) => {
    return listProjects(data.locale, data.limit, data.selectedOnly)
  })
