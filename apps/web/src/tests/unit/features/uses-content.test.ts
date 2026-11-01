import type { MdxModule } from '@repo/mdx'
import type { UsesSectionData } from '@/features/profile/uses-page'

import { existsSync } from 'node:fs'
import path from 'node:path'

import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test } from 'vitest'

type UsesSectionsProps = {
  sections: UsesSectionData[]
}

const documents = import.meta.glob<MdxModule>('/content/pages/*/uses.mdx', { eager: true })

describe('Uses content', () => {
  test.each(['en', 'zh-TW', 'zh-CN', 'ja', 'es', 'pt-BR'])(
    '%s supplies all 33 entries and two monitors to the shared sidebar and cards',
    (locale) => {
      let sections: UsesSectionData[] = []
      const document = documents[`/content/pages/${locale}/uses.mdx`]
      expect(document).toBeDefined()
      if (!document) return

      renderToStaticMarkup(
        createElement(document.default, {
          components: {
            UsesSections: (props: UsesSectionsProps) => {
              sections = props.sections
              return null
            },
          },
        }),
      )

      expect(sections.map((section) => section.kind)).toEqual([
        'laptop',
        'accessories',
        'hardware',
        'coding',
        'software',
      ])
      expect(sections.map((section) => section.items.length)).toEqual([1, 2, 11, 6, 13])
      expect(sections.every((section) => section.title.length > 0)).toBe(true)

      const items = sections.flatMap<UsesSectionData['items'][number]>((section) => section.items)
      expect(items).toHaveLength(33)
      for (const item of items) {
        const image = 'src' in item ? item.src : item.image
        expect(existsSync(path.resolve(process.cwd(), `public${image}`))).toBe(true)
        expect(item.name).not.toBe('')
        expect(item.description).not.toBe('')
      }

      const linkedItems = sections.flatMap((section) => (section.kind === 'laptop' ? [] : section.items))
      expect(linkedItems).toHaveLength(32)
      expect(linkedItems.every((item) => item.url.startsWith('https://'))).toBe(true)
      expect(linkedItems.filter((item) => item.quantity === 2).map((item) => item.name)).toEqual([
        'ASUS TUF Gaming VG27UQ1A',
      ])
    },
  )
})
