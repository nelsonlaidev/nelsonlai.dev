import fs from 'node:fs/promises'
import path from 'node:path'

import { consola } from 'consola'

import { db } from './index'
import { posts } from './schemas'

async function main() {
  try {
    const files = await fs.readdir(path.join(process.cwd(), 'src/content/blog/en'))

    await Promise.all(
      files.map(async (file) => {
        const slug = file.replace('.mdx', '')
        await db.insert(posts).values({ slug, views: 0 })
      }),
    )

    consola.success('Data inserted successfully!')
  } catch (error) {
    consola.error('Error inserting data:\n', error)
  } finally {
    await db.$client.end()
  }
}

await main()
