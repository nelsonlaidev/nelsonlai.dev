import { createServerFn } from '@tanstack/react-start'
import * as z from 'zod'

import { locales } from '@/paraglide/runtime'

import { findPost, listPosts } from './posts.server'

export const getPost = createServerFn({ method: 'GET' })
  .validator(
    z.object({
      slug: z.string().min(1),
      locale: z.enum(locales),
    }),
  )
  .handler(({ data }) => findPost(data.slug, data.locale))

export const getPosts = createServerFn({ method: 'GET' })
  .validator(
    z.object({
      locale: z.enum(locales),
      limit: z.number().int().min(1).max(50).nullable().default(null),
    }),
  )
  .handler(({ data }) => listPosts(data.locale, data.limit))
