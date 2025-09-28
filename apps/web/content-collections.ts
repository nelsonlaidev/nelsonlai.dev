import { type Context, defineCollection, defineConfig, type Meta } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import { z } from 'zod'

import { getTOC, rehypePlugins, remarkPlugins } from '@/mdx-plugins'

type BaseDoc = {
  _meta: Meta
  content: string
}

type TransformOptions = {
  routeBase?: string
  coverImageBasePath?: string
}

const ensureLeadingSlash = (value: string) => {
  if (!value) {
    return ''
  }

  return value.startsWith('/') ? value : `/${value}`
}

const ensureNoTrailingSlash = (value: string) => {
  if (value.length <= 1) {
    return value
  }

  return value.endsWith('/') ? value.slice(0, -1) : value
}

const toPosixPath = (value: string) => value.replaceAll('\\', '/')

const getPathname = (routeBase: string, slug: string) => {
  const normalizedBase = ensureNoTrailingSlash(ensureLeadingSlash(routeBase))
  const normalizedSlug = slug === 'index' ? '' : `/${slug}`
  const pathname = `${normalizedBase}${normalizedSlug}`

  return pathname === '' ? '/' : pathname
}

const getOgImagePathname = (pathname: string) => {
  return `${pathname === '/' ? '' : pathname}/og-image.png`
}

const getCoverImagePathname = (coverImageBasePath: string | undefined, slug: string) => {
  if (!coverImageBasePath) {
    return
  }

  const normalizedBase = ensureNoTrailingSlash(ensureLeadingSlash(coverImageBasePath))

  return `${normalizedBase}/${slug}/cover.png`
}

const getSourceFilePath = (context: Context, document: BaseDoc) => {
  const segments = ['apps/web', context.collection.directory, document._meta.filePath]

  return toPosixPath(segments.join('/'))
}

const createTransform = (options: TransformOptions = {}) => {
  const { routeBase = '', coverImageBasePath } = options

  return async <D extends BaseDoc>(document: D, context: Context) => {
    const code = await compileMDX(context, document, {
      remarkPlugins,
      rehypePlugins
    })
    const [locale, path] = document._meta.path.split(/[/\\]/)

    if (!locale || !path) {
      throw new Error(`Invalid path: ${document._meta.path}`)
    }

    const pathname = getPathname(routeBase, path)
    const ogImagePathname = getOgImagePathname(pathname)
    const coverImagePathname = getCoverImagePathname(coverImageBasePath, path)
    const sourceFilePath = getSourceFilePath(context, document)

    return {
      ...document,
      code,
      locale,
      slug: path,
      pathname,
      ogImagePathname,
      ...(coverImagePathname ? { coverImagePathname } : {}),
      sourceFilePath,
      toc: await getTOC(document.content)
    }
  }
}

const posts = defineCollection({
  name: 'Post',
  directory: 'src/content/blog',
  include: '**/*.mdx',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    modifiedTime: z.string(),
    summary: z.string()
  }),
  transform: createTransform({
    routeBase: '/blog',
    coverImageBasePath: '/images/blog'
  })
})

const projects = defineCollection({
  name: 'Project',
  directory: 'src/content/projects',
  include: '**/*.mdx',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    homepage: z.string().optional(),
    github: z.string(),
    techstack: z.array(z.string()),
    selected: z.boolean().optional().default(false),
    dateCreated: z.string()
  }),
  transform: createTransform({
    routeBase: '/projects',
    coverImageBasePath: '/images/projects'
  })
})

const pages = defineCollection({
  name: 'Page',
  directory: 'src/content/pages',
  include: '**/*.mdx',
  schema: z.object({}),
  transform: createTransform()
})

export default defineConfig({
  collections: [posts, projects, pages]
})
