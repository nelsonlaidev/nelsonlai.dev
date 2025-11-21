import { type InferPageType, loader } from 'fumadocs-core/source'
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons'
import { docs } from 'fumadocs-mdx:collections/server'

declare module 'fumadocs-core/page-tree' {
  interface Item {
    package?: 'ark-ui'
  }
}

export const source = loader({
  baseUrl: '/',
  source: docs.toFumadocsSource(),
  plugins: ({ typedPlugin }) => [
    lucideIconsPlugin(),
    typedPlugin({
      transformPageTree: {
        file: (node) => {
          const page = source.getPage(node.url.split('/').filter(Boolean))

          if (page?.data.api?.includes('ark-ui')) {
            node.package = 'ark-ui'
          }

          return node
        }
      }
    })
  ]
})

export const getPageImage = (page: InferPageType<typeof source>) => {
  const segments = [...page.slugs, 'image.png']

  return {
    segments,
    url: `/og/${segments.join('/')}`
  }
}

export const getLLMText = async (page: InferPageType<typeof source>) => {
  const processed = await page.data.getText('processed')

  return `# ${page.data.title} (${page.url})

${processed}`
}
