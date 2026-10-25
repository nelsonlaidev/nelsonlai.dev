import { createServerFn } from '@tanstack/react-start'
import * as z from 'zod'

import { listProjects } from './projects.server'

export const getProjects = createServerFn({ method: 'GET' })
  .validator(
    z.object({
      locale: z.string(),
      limit: z.number().int().min(1).max(50).nullable(),
      selectedOnly: z.boolean().default(false),
    }),
  )
  .handler(({ data }) => {
    return listProjects(data.locale, data.limit, data.selectedOnly)
  })
