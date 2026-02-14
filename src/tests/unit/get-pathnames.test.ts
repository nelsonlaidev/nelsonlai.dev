import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { describe, expect, test } from 'vitest'

import { getPathnames, PROTECTED_ROUTES } from '@/utils/get-pathnames'

type PageModule = {
  generateStaticParams?: () => Promise<Array<Record<string, string>>>
}

describe('pathnames', () => {
  test('returns all page routes', async () => {
    expect.assertions(1)

    const pathnames = getPathnames()
    const allPageRoutes = await getAllPageRoutes()

    const sortedPathnames = [...pathnames].toSorted((a, b) => a.localeCompare(b))
    const sortedAllPageRoutes = [...allPageRoutes].toSorted((a, b) => a.localeCompare(b))

    expect(sortedPathnames).toStrictEqual(sortedAllPageRoutes)
  })
})

async function getAllPageRoutes(): Promise<string[]> {
  const rootDir = 'src/app'

  const entries = await fs.readdir(rootDir, { recursive: true })
  const pageFiles = entries
    .filter((entry) => entry.endsWith('/page.tsx') || entry === 'page.tsx')
    .map((entry) => path.join(rootDir, entry))

  const rscResults = await Promise.all(
    pageFiles.map(async (filePath) => ({
      filePath,
      isRsc: await isRSCPage(filePath),
    })),
  )
  const nonRscPages = rscResults.filter((r) => !r.isRsc).map((r) => r.filePath)

  const routeArrays = await Promise.all(nonRscPages.map(async (fullPath) => processPageFile(fullPath, rootDir)))

  const result = routeArrays.flat()
  const uniqueRoutes = [...new Set(result)]
  return uniqueRoutes.filter((route) => !PROTECTED_ROUTES.includes(route))
}

async function processPageFile(fullPath: string, rootDir: string): Promise<string[]> {
  const pathParts = getPathParts(fullPath, rootDir)
  const hasDynamic = pathParts.some((part) => part.startsWith('[') && part.endsWith(']'))

  if (!hasDynamic) {
    return [`/${pathParts.join('/')}`]
  }

  return processDynamicPage(fullPath, pathParts)
}

function getPathParts(fullPath: string, rootDir: string): string[] {
  const relativePath = path.relative(rootDir, fullPath)
  return relativePath.split('/').filter((part) => {
    if (part === '[locale]') return false
    if (part.startsWith('(') && part.endsWith(')')) return false
    if (part === 'page.tsx') return false
    return true
  })
}

async function processDynamicPage(fullPath: string, pathParts: string[]): Promise<string[]> {
  const modPath = pathToFileURL(fullPath).href
  const pageModule = (await import(modPath)) as PageModule

  if (typeof pageModule.generateStaticParams !== 'function') {
    return []
  }

  const paramsArray = await pageModule.generateStaticParams()

  return paramsArray.map((rawParams) => {
    const params = { ...rawParams }
    delete params.locale

    const resolved = pathParts
      .map((part) => {
        // Check for dynamic segment like [id]
        if (part.startsWith('[') && part.endsWith(']')) {
          const key = part.slice(1, -1)
          const value = params[key]

          if (value === undefined) {
            throw new Error(`generateStaticParams in ${fullPath} is missing the required parameter: "${key}"`)
          }

          return value
        }
        return part
      })
      .join('/')

    return `/${resolved}`
  })
}

async function isRSCPage(filePath: string): Promise<boolean> {
  const content = await fs.readFile(filePath, 'utf8')

  return content.includes('async function Page')
}
