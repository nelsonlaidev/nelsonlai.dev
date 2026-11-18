import type { Plugin } from 'vite'

import path from 'node:path'

import manifest from 'material-icon-theme/dist/material-icons.json' with { type: 'json' }
import { bundledLanguagesInfo } from 'shiki/langs'

const moduleId = 'virtual:language-icons'

export function languageIconsPlugin(): Plugin {
  return {
    name: 'language-icons',
    resolveId(id) {
      return id === moduleId ? `\0${moduleId}` : null
    },
    load(id) {
      if (id !== `\0${moduleId}`) return

      const languages = new Map(Object.entries(manifest.languageIds))
      const associations = new Map([
        ...Object.keys(manifest.iconDefinitions).map((name) => [name, name] as const),
        ...Object.entries(manifest.fileNames),
        ...Object.entries(manifest.fileExtensions),
        ...languages,
      ])

      for (const { id: language, aliases = [] } of bundledLanguagesInfo) {
        const names = [language, ...aliases]
        const icon = names.map((name) => associations.get(name)).find((name) => name !== undefined)
        if (icon) {
          for (const name of names) languages.set(name, icon)
        }
      }

      const definitions = new Map(Object.entries(manifest.iconDefinitions))
      const imports: string[] = []
      const entries: string[] = []

      for (const [icon, mappings] of Map.groupBy(languages, ([, name]) => name)) {
        const definition = definitions.get(icon)
        if (!definition) continue

        const binding = `icon${imports.length}`
        const asset = `${path.posix.join('material-icon-theme/dist', definition.iconPath)}?no-inline`
        imports.push(`import ${binding} from ${JSON.stringify(asset)}`)
        for (const [language] of mappings) entries.push(`[${JSON.stringify(language)}, ${binding}]`)
      }

      return [...imports, `export default new Map([${entries.join(',')}])`].join('\n')
    },
  }
}
