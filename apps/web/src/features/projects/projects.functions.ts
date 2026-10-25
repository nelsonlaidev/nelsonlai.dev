import { createServerFn } from '@tanstack/react-start'
import * as z from 'zod'

import { locales } from '@/paraglide/runtime'

import { listProjects } from './projects.server'

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
