import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from 'fumadocs-mdx/config'
import * as z from 'zod'

export const docs = defineDocs({
  dir: 'src/content',
  docs: {
    schema: frontmatterSchema.extend({
      docs: z.url().optional(),
      api: z.url().optional()
    }),
    postprocess: {
      includeProcessedMarkdown: true
    }
  },
  meta: {
    schema: metaSchema
  }
})

export default defineConfig()
