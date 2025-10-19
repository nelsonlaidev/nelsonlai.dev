import type { RegistryItem } from '@/types/registry-item'

import fs from 'node:fs/promises'

import { consola } from 'consola'

const REGISTRY = 'https://ui.shadcn.com/r'
const UI_DIR = 'src/components/ui'

const DEPRECATED_COMPONENTS = new Set(['toast'])

const main = async () => {
  const index = await fetch(`${REGISTRY}/index.json`)
  const components: RegistryItem[] = await index.json()
  const componentNames = components
    .map((component) => component.name)
    .filter((name) => !DEPRECATED_COMPONENTS.has(name))

  const selectedComponents = await consola.prompt('Select components to add', {
    type: 'multiselect',
    required: true,
    options: componentNames
  })

  consola.start('Adding selected components...')

  for (const componentName of selectedComponents) {
    const componentRegistry = await fetch(`${REGISTRY}/styles/new-york-v4/${componentName}.json`)
    const component: RegistryItem = await componentRegistry.json()

    for (const file of component.files ?? []) {
      if (!file.path || !file.content) continue

      consola.info(`Adding file: ${file.path}`)

      await fs.writeFile(`${UI_DIR}/${componentName}.tsx`, file.content)
    }
  }

  consola.success('Added components: ' + selectedComponents.join(', '))
}

await main()
