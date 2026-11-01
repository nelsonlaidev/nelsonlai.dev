import type { Meta } from '@content-collections/core'

import { defineCollection, defineConfig } from '@content-collections/core'
import * as z from 'zod'

import { locales } from './project.inlang/settings.json'

function documentMetadata<
  T extends {
    _meta: Meta
    content: string
  },
>(document: T, kind: 'blog' | 'projects' | 'pages') {
  // oxlint-disable-next-line sonarjs/no-unused-vars -- Exclude document bodies from generated metadata.
  const { _meta, content: _content, ...metadata } = document
  const [locale, ...slugParts] = _meta.path.split('/')
  const slug = slugParts.join('/')

  if (!locale || !locales.includes(locale) || !slug) {
    throw new Error(`Invalid content path: content/${kind}/${_meta.filePath}`)
  }

  // Matches Vite's root-relative MDX glob keys, including nested slugs.
  return { ...metadata, path: `/content/${kind}/${_meta.filePath}`, locale, slug }
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
  transform: (document) => documentMetadata(document, 'blog'),
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
    techstack: z.array(z.string()),
    subtitle: z.string().optional(),
    category: z.string().optional(),
    features: z.array(z.object({ title: z.string(), text: z.string() })).optional(),
    journey: z.string().optional(),
    selected: z.boolean().default(false),
    dateCreated: z.iso.datetime(),
  }),
  transform: (document) => documentMetadata(document, 'projects'),
})

const pages = defineCollection({
  name: 'pages',
  directory: 'content/pages',
  include: '**/*.mdx',
  schema: pageSchema,
  transform: (document) => documentMetadata(document, 'pages'),
})

export default defineConfig({ content: [posts, projects, pages] })
