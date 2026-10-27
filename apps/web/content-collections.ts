import type { CollectionContext, Meta } from '@content-collections/core'

import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import { getTOC, rehypePlugins, remarkPlugins } from '@repo/mdx-plugins'
import * as z from 'zod'

import { locales } from './project.inlang/settings.json'

async function transformContent<T extends { _meta: Meta; content: string }>(document: T, context: CollectionContext) {
  const [locale, ...slugParts] = document._meta.path.split('/')

  if (!locale || !locales.includes(locale)) {
    throw new Error(`Invalid locale "${locale}" in path "${document._meta.path}".`)
  }

  const slug = slugParts.join('/')

  if (!slug) {
    throw new Error(`Missing slug in path "${document._meta.path}".`)
  }

  const [mdx, toc] = await Promise.all([
    compileMDX(context, document, { remarkPlugins, rehypePlugins }),
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
    content: z.string(),
  }),
  transform: transformContent,
})

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
  transform: transformContent,
})

const pages = defineCollection({
  name: 'pages',
  directory: 'content/pages',
  include: '**/*.mdx',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    content: z.string(),
  }),
  transform: transformContent,
})

export default defineConfig({
  content: [posts, projects, pages],
})
