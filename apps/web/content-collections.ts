import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import * as z from 'zod'

import { isLocale } from '@/paraglide/runtime'

const projects = defineCollection({
  name: 'projects',
  directory: 'content/projects',
  include: '**/*.mdx',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    homepage: z.string().optional(),
    github: z.string(),
    techstack: z.array(z.string()),
    selected: z.boolean().optional().default(false),
    dateCreated: z.string(),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document)
    const [locale, ...slugParts] = document._meta.path.split('/')

    if (!isLocale(locale)) {
      throw new Error(`Invalid locale "${locale}" in path "${document._meta.path}".`)
    }

    const slug = slugParts.join('/')

    if (!slug) {
      throw new Error(`Missing slug in path "${document._meta.path}".`)
    }

    return { ...document, locale, slug, mdx }
  },
})

export default defineConfig({
  content: [projects],
})
