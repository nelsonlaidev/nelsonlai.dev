// Based on wevm/vocs (MIT License)
// Copyright (c) weth, LLC
// Source: https://github.com/wevm/vocs/blob/75e0cfc874e7abe8648be139a8554e1fe87a18d1/src/vite/plugins/rehype/inline-shiki.ts
//
// Based on shikijs/shiki (MIT License)
// Copyright (c) Pine Wu and Anthony Fu
// Source: https://github.com/shikijs/shiki/blob/481135b16287d7dabc2e155f427af63d3ff3536d/packages/rehype/src/index.ts
//
// Modified by: Nelson Lai
import type { Root } from 'hast'
import type { Highlighter } from 'shiki'

import { bundledLanguages, getSingletonHighlighter } from 'shiki'
import { visit } from 'unist-util-visit'

import { DEFAULT_SHIKI_THEME } from './rehype-code'

const inlineShikiRegex = /^(.*?)\{:(.*)\}$/

function getScopeColor(highlighter: Highlighter, scope: string): string {
  return (
    highlighter.getTheme(DEFAULT_SHIKI_THEME).settings.find(({ scope: themeScope }) => themeScope?.includes(scope))
      ?.settings.foreground ?? 'inherit'
  )
}

async function transformer(tree: Root) {
  const highlighter = await getSingletonHighlighter({
    themes: [DEFAULT_SHIKI_THEME],
    langs: Object.keys(bundledLanguages),
  })

  visit(tree, 'element', (node, index, parent) => {
    if (node.tagName !== 'code') return

    const childNode = node.children[0]

    if (childNode?.type !== 'text') return

    const match = inlineShikiRegex.exec(childNode.value)
    if (!match) return

    const [, code, lang] = match

    if (!code || !lang) return

    const isLang = !lang.startsWith('.')

    const hast = highlighter.codeToHast(code, {
      theme: DEFAULT_SHIKI_THEME,
      lang: isLang ? lang : 'plaintext',
    })

    const preNode = hast.children[0]

    if (preNode?.type !== 'element') return
    if (preNode.tagName !== 'pre') return

    const inlineCode = preNode.children[0]
    if (inlineCode?.type !== 'element') return

    // Set the color by scope if language is not specified
    // For example: `myFunction{:.entity.name.function}`
    if (!isLang) {
      const color = getScopeColor(highlighter, lang.slice(1))
      const spanNode = inlineCode.children[0]

      if (spanNode?.type !== 'element') return
      if (spanNode.tagName !== 'span') return

      spanNode.properties.style = `color:${color}`
    }

    inlineCode.properties.className = ['shiki']

    parent?.children.splice(index ?? 0, 1, inlineCode)
  })
}

export function rehypeInlineCode() {
  return transformer
}
