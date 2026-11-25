import 'varlock/auto-load'

import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { createDatabase } from './index'
import { posts } from './schema/posts'

const postsDirectory = fileURLToPath(new URL('../../../apps/web/content/blog/', import.meta.url))
const entries = await readdir(postsDirectory, { recursive: true, withFileTypes: true })
const slugs = new Set<string>()

for (const entry of entries) {
  if (!entry.isFile() || !entry.name.endsWith('.mdx')) continue

  const relativePath = path.relative(postsDirectory, path.join(entry.parentPath, entry.name))
  const [locale, ...slugParts] = relativePath.split(path.sep)
  const slug = slugParts.join('/').slice(0, -4)

  if (!locale || !slug) {
    throw new Error(`Expected a locale and slug in post path "${relativePath}".`)
  }

  slugs.add(slug)
}

if (slugs.size === 0) {
  throw new Error('No MDX posts found in the content directory.')
}

const db = createDatabase()

try {
  const inserted = await db
    .insert(posts)
    .values([...slugs].toSorted().map((slug) => ({ slug })))
    .onConflictDoNothing({ target: posts.slug })
    .returning({ slug: posts.slug })

  console.log(`Post seed complete: ${inserted.length} inserted, ${slugs.size - inserted.length} already present.`)
} finally {
  await db.$client.end()
}
