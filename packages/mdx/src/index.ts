import type { PluginOption } from 'vite'

import mdxRollup from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'

import { rehypeCode } from './rehype/rehype-code'
import { rehypeInlineCode } from './rehype/rehype-inline-code'
import { rehypeShikiStyles } from './rehype/rehype-shiki-styles'
import { remarkHeadings } from './remark/remark-headings'

const remarkPlugins = [remarkFrontmatter, remarkGfm, remarkHeadings]
const rehypePlugins = [rehypeCode, rehypeInlineCode, rehypeShikiStyles]

/** Compile static React modules with the official MDX Rollup integration. */
export function mdx(): PluginOption {
  const compiler = mdxRollup({ remarkPlugins, rehypePlugins })

  return {
    ...compiler,
    transform: {
      async handler(source, id) {
        const result = await compiler.transform(source, id)
        // Normalize Rollup's result for Vite's Rolldown-backed transform interface.
        const map = result?.map
        const normalizedMap = typeof map === 'object' && map !== null ? JSON.stringify(map) : map
        return (
          result && {
            code: result.code,
            map: normalizedMap,
          }
        )
      },
    },
  }
}

export type { MdxModule, TOC } from './types'
