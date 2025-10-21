import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { describe, expect, it } from 'vitest'

import { getPathnames, PROTECTED_ROUTES } from '@/utils/get-pathnames'

type PageModule = {
  generateStaticParams?: () => Promise<Array<Record<string, string>>>
}

describe('pathnames', () => {
  it('returns all page routes', async () => {
    const pathnames = getPathnames()
    const allPageRoutes = await getAllPageRoutes()

    const sortedPathnames = [...pathnames].toSorted((a, b) => a.localeCompare(b))
    const sortedAllPageRoutes = [...allPageRoutes].toSorted((a, b) => a.localeCompare(b))

    expect(sortedPathnames).toEqual(sortedAllPageRoutes)
  })
})

const getAllPageRoutes = async (): Promise<string[]> => {
  const rootDir = 'apps/web/src/app'

  const result: string[] = []
  const queue: string[] = [rootDir]

  while (queue.length > 0) {
    const currentDir = queue.pop()!
    const entries = await fs.readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)

      if (entry.isDirectory()) {
        queue.push(fullPath)
        continue
      }

      if (!entry.isFile() || entry.name !== 'page.tsx') continue
      if (await isRSCPage(fullPath)) continue

      const route = await processPageFile(fullPath, rootDir)
      result.push(...route)
    }
  }

  const uniqueRoutes = [...new Set(result)]
  return uniqueRoutes.filter((route) => !PROTECTED_ROUTES.includes(route))
}

const processPageFile = async (fullPath: string, rootDir: string): Promise<string[]> => {
  const pathParts = getPathParts(fullPath, rootDir)
  const hasDynamic = pathParts.some((part) => part.startsWith('[') && part.endsWith(']'))

  if (!hasDynamic) {
    return ['/' + pathParts.join('/')]
  }

  return await processDynamicPage(fullPath, pathParts)
}

const getPathParts = (fullPath: string, rootDir: string): string[] => {
  const relativePath = path.relative(rootDir, fullPath)
  return relativePath.split('/').filter((part) => {
    if (part === '[locale]') return false
    if (part.startsWith('(') && part.endsWith(')')) return false
    if (part === 'page.tsx') return false
    return true
  })
}

const processDynamicPage = async (fullPath: string, pathParts: string[]): Promise<string[]> => {
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
        if (part.startsWith('[') && part.endsWith(']')) {
          const key = part.slice(1, -1)
          return params[key]!
        }
        return part
      })
      .join('/')

    return '/' + resolved
  })
}

const isRSCPage = async (filePath: string): Promise<boolean> => {
  const content = await fs.readFile(filePath, 'utf8')

  return content.includes('const Page = async')
}
