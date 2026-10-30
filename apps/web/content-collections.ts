import type { CollectionContext, Meta } from '@content-collections/core'

import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import { getTOC, oceanRehypePlugins, rehypePlugins, remarkPlugins } from '@repo/mdx-plugins'
import * as z from 'zod'

import { locales } from './project.inlang/settings.json'

async function transformContent<T extends { _meta: Meta; content: string }>(
  document: T,
  context: CollectionContext,
  ocean = false,
) {
  const [locale, ...slugParts] = document._meta.path.split('/')

  if (!locale || !locales.includes(locale)) {
    throw new Error(`Invalid locale "${locale}" in path "${document._meta.path}".`)
  }

  const slug = slugParts.join('/')

  if (!slug) {
    throw new Error(`Missing slug in path "${document._meta.path}".`)
  }

  const [mdx, toc] = await Promise.all([
    compileMDX(context, document, { remarkPlugins, rehypePlugins: ocean ? oceanRehypePlugins : rehypePlugins }),
    context.cache(document.content, getTOC, { key: 'toc' }),
  ])

  return { ...document, locale, slug, mdx, toc }
}

const posts = defineCollection({
  name: 'posts',
  directory: 'content/blog',
  include: '**/*.mdx',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    content: z.string(),
  }),
  transform: async (document, context) => transformContent(document, context, true),
})

const projects = defineCollection({
  name: 'projects',
  directory: 'content/projects',
  include: '**/*.mdx',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    homepage: z.url().optional(),
    github: z.url().optional(),
    schemaType: z.enum(['SoftwareSourceCode', 'SoftwareApplication']),
    license: z.url().optional(),
    programmingLanguages: z.array(z.string().min(1)).min(1).optional(),
    techstack: z.array(z.string()),
    subtitle: z.string().optional(),
    category: z.string().optional(),
    features: z.array(z.object({ title: z.string(), text: z.string() })).optional(),
    journey: z.string().optional(),
    selected: z.boolean().optional().default(false),
    dateCreated: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    content: z.string(),
  }),
  transform: transformContent,
})

const pages = defineCollection({
  name: 'pages',
  directory: 'content/pages',
  include: '**/*.mdx',
  schema: z.object({
    title: z.string(),
    updatedAt: z.iso.datetime(),
    description: z.string(),
    content: z.string(),
  }),
  transform: transformContent,
})

export default defineConfig({
  content: [posts, projects, pages],
})
