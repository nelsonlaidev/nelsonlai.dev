import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, test } from 'vitest'

import { usesInventory } from '@/features/profile/uses-inventory'

const root = process.cwd()

describe('Uses inventory navigation', () => {
  test.each(['en', 'zh-TW', 'zh-CN', 'ja', 'es', 'pt-BR'])(
    '%s keeps all 33 items with real local images and two monitors',
    (locale) => {
      const content = readFileSync(path.resolve(root, `content/pages/${locale}/uses.mdx`), 'utf-8')
      const sections = usesInventory(content)
      expect(sections.map((section) => section.id)).toEqual(['laptop', 'accessories', 'hardware', 'coding', 'software'])
      expect(sections.map((section) => section.count)).toEqual([1, 2, 11, 6, 13])
      expect(content.match(/quantity: 2/g)).toHaveLength(1)
      const images = [...content.matchAll(/(?:image: |src=)'([^']+)'/g)]
      expect(images).toHaveLength(33)
      for (const image of images) expect(existsSync(path.resolve(root, `public${image[1]}`))).toBe(true)
      expect(content.match(/url: 'https:\/\//g)).toHaveLength(32)
    },
  )

  test('supports both MDX quote styles and whitespace', () => {
    expect(
      usesInventory(
        `<UsesSection\nkind="software" title="Software">\n<UsesItems items={[{image: '/one.png'}, {image: '/two.png'}]} />\n</UsesSection>`,
      ),
    ).toEqual([{ id: 'software', title: 'Software', count: 2 }])
  })
})
