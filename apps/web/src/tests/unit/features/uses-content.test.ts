import type { UsesLaptopProps, UsesSectionProps } from '@/routes/_main/uses'

import { existsSync } from 'node:fs'
import path from 'node:path'

import { MDXContent } from '@content-collections/mdx/react'
import { allPages } from 'content-collections'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test } from 'vitest'

describe('Uses content', () => {
  test.each(['en', 'zh-TW', 'zh-CN', 'ja', 'es', 'pt-BR'])(
    '%s supplies the standalone laptop and four item sections',
    (locale) => {
      let laptop: UsesLaptopProps | undefined
      const sections: UsesSectionProps[] = []

      const document = allPages.find((page) => page.slug === 'uses' && page.locale === locale)
      expect(document).toBeDefined()
      if (!document) return

      renderToStaticMarkup(
        createElement(MDXContent, {
          code: document.code,
          components: {
            UsesLaptop: (props: UsesLaptopProps) => {
              laptop = props
              return null
            },
            UsesSection: (props: UsesSectionProps) => {
              sections.push(props)
              return null
            },
          },
        }),
      )

      expect(sections.map((section) => section.id)).toEqual(['accessories', 'hardware', 'coding', 'software'])
      expect(sections.map((section) => section.items.length)).toEqual([2, 11, 6, 13])
      expect(sections.every((section) => section.title.length > 0)).toBe(true)

      expect(laptop).toBeDefined()
      if (!laptop) return

      expect(laptop.title).not.toBe('')
      expect(laptop.name).not.toBe('')
      expect(laptop.description).not.toBe('')
      expect(existsSync(path.resolve(process.cwd(), `public${laptop.src}`))).toBe(true)

      const items = sections.flatMap((section) => section.items)
      for (const item of items) {
        expect(existsSync(path.resolve(process.cwd(), `public${item.image}`))).toBe(true)
        expect(item.name).not.toBe('')
        expect(item.description).not.toBe('')
        expect(item.url.startsWith('https://')).toBe(true)
      }
    },
  )
})
