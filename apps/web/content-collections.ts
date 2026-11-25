import type { CollectionContext, Meta } from '@content-collections/core'

import path from 'node:path'

import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import { getTOC, rehypePlugins, remarkPlugins } from '@repo/mdx'
import * as z from 'zod'

import { locales } from './project.inlang/settings.json'

async function documentMetadata<
  T extends {
    _meta: Meta
    content: string
  },
>(document: T, context: CollectionContext, kind: 'blog' | 'projects' | 'pages') {
  const { _meta, content: _content, ...metadata } = document
  const [locale, ...slugParts] = _meta.path.split('/')
  const slug = slugParts.join('/')

  if (!locale || !locales.includes(locale) || !slug) {
    throw new Error(`Invalid content path: content/${kind}/${_meta.filePath}`)
  }

  const [code, toc] = await Promise.all([
    compileMDX(context, document, {
      cwd: path.resolve('content', kind, _meta.directory),
      remarkPlugins,
      rehypePlugins,
    }),
    context.cache(document.content, getTOC, { key: 'toc' }),
  ])

  return { ...metadata, code, toc, locale, slug }
}

const pageSchema = z.object({
  title: z.string(),
  description: z.string(),
  updatedAt: z.iso.datetime(),
  content: z.string(),
})

const posts = defineCollection({
  name: 'posts',
  directory: 'content/blog',
  include: '**/*.mdx',
  schema: pageSchema.extend({ publishedAt: z.iso.datetime() }),
  transform: async (document, context) => documentMetadata(document, context, 'blog'),
})

const projects = defineCollection({
  name: 'projects',
  directory: 'content/projects',
  include: '**/*.mdx',
  schema: pageSchema.extend({
    homepage: z.url().optional(),
    github: z.url().optional(),
    schemaType: z.enum(['SoftwareSourceCode', 'SoftwareApplication']),
    license: z.url().optional(),
    programmingLanguages: z.array(z.string().min(1)).min(1).optional(),
    artwork: z.enum(['pearl', 'cube', 'coral', 'terminal', 'pages', 'tools', 'journal']),
    techstack: z.array(z.string()),
    category: z.string().optional(),
    features: z.array(z.object({ title: z.string(), text: z.string() })).optional(),
    selected: z.boolean().default(false),
    dateCreated: z.iso.datetime(),
  }),
  transform: async (document, context) => documentMetadata(document, context, 'projects'),
})

const pages = defineCollection({
  name: 'pages',
  directory: 'content/pages',
  include: '**/*.mdx',
  schema: pageSchema,
  transform: async (document, context) => documentMetadata(document, context, 'pages'),
})

export default defineConfig({ content: [posts, projects, pages] })
