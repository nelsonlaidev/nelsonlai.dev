import { createServerFn } from '@tanstack/react-start'
import * as z from 'zod'

import { locales } from '@/paraglide/runtime'

import { findPage } from './pages.server'

export const getPage = createServerFn({ method: 'GET' })
  .validator(z.object({ slug: z.string().min(1), locale: z.enum(locales) }))
  .handler(({ data }) => findPage(data.slug, data.locale))
