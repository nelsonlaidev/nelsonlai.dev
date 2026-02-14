// Based on fuma-nama/fumadocs (MIT License)
// Copyright (c) fuma-nama
// Source: https://github.com/fuma-nama/fumadocs/blob/7b18075cc97ca876ab14b22f05349a09dc0e4025/packages/core/src/mdx-plugins/rehype-code.ts
//
// Modified by: Nelson Lai
import type { Root } from 'hast'
import type { Transformer } from 'unified'

import rehypeShikiFromHighlighter from '@shikijs/rehype/core'
import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers'
import { bundledLanguages, getSingletonHighlighter, type ShikiTransformer } from 'shiki'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'

const titleRegex = /title=["']([^"']*)["']/

export const DEFAULT_SHIKI_THEMES = {
  light: 'github-light-default',
  dark: 'github-dark-default',
}

export function rehypeCode(): Transformer<Root, Root> {
  const transformers: ShikiTransformer[] = [
    {
      preprocess(code, { meta }) {
        // Remove title from meta
        if (meta) meta.__raw = meta.__raw?.replace(titleRegex, '')
        // Remove trailing newline
        return code.replace(/\n$/, '')
      },
      root(hast) {
        const pre = hast.children[0]
        if (pre?.type !== 'element') return
        hast.children = [
          {
            ...pre,
            properties: {
              ...pre.properties,
              'data-lang': this.options.lang,
            },
          },
        ]
      },
    },
    transformerNotationHighlight({
      matchAlgorithm: 'v3',
    }),
    transformerNotationWordHighlight({
      matchAlgorithm: 'v3',
    }),
    transformerNotationDiff({
      matchAlgorithm: 'v3',
    }),
    transformerNotationFocus({
      matchAlgorithm: 'v3',
    }),
  ]

  const highlighter = getSingletonHighlighter({
    engine: createOnigurumaEngine(import('shiki/wasm')),
    themes: Object.values(DEFAULT_SHIKI_THEMES),
    langs: Object.keys(bundledLanguages),
  })

  return async (tree, file) => {
    const instance = await highlighter
    const transformer = rehypeShikiFromHighlighter(instance, {
      themes: DEFAULT_SHIKI_THEMES,
      defaultColor: false,
      defaultLanguage: 'plaintext',
      transformers,
      parseMetaString: (meta) => {
        const titleMatch = titleRegex.exec(meta)
        const title = titleMatch?.[1] ?? null

        return { title }
      },
    })

    await transformer(tree, file, () => {
      // Do nothing
    })
  }
}
