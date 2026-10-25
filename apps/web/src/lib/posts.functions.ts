import { createServerFn } from '@tanstack/react-start'
import * as z from 'zod'

import { locales } from '@/paraglide/runtime'

import { listPosts } from './posts.server'

export const getPosts = createServerFn({ method: 'GET' })
  .validator(
    z.object({
      locale: z.enum(locales),
      limit: z.number().int().min(1).max(50).nullable().default(null),
    }),
  )
  .handler(({ data }) => {
    return listPosts(data.locale, data.limit)
  })
