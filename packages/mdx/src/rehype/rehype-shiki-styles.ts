import type { Root } from 'hast'
import type { Transformer } from 'unified'

import { createHash } from 'node:crypto'

import { visit } from 'unist-util-visit'

/** Preserve compiled syntax colors without CSP-blocked style attributes. */
export function rehypeShikiStyles(): Transformer<Root> {
  return (tree) => {
    const rules = new Map<string, string>()

    visit(tree, 'element', (node) => {
      const style = node.properties.style
      if (typeof style !== 'string') return

      // These classes are emitted into the stylesheet below, independently of Tailwind.
      // oxlint-disable-next-line better-tailwindcss/no-concatenated-classes
      const className = `mdx-${createHash('sha256').update(style).digest('hex').slice(0, 16)}`
      const classes = node.properties.className ?? node.properties.class
      let existingClasses: string[] = []
      if (Array.isArray(classes)) existingClasses = classes.map(String)
      else if (typeof classes === 'string') existingClasses = classes.split(/\s+/)
      node.properties.className = [...existingClasses, className]
      delete node.properties.class
      delete node.properties.style
      rules.set(className, `.${className}{${style}}`)
    })

    if (rules.size > 0) {
      tree.children.push({
        type: 'element',
        tagName: 'style',
        properties: {},
        children: [{ type: 'text', value: [...rules.values()].join('\n') }],
      })
    }
  }
}
