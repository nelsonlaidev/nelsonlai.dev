import 'varlock/auto-load'

import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'

import { consola } from 'consola'
import { sql } from 'drizzle-orm'
import { execa } from 'execa'

import { ENV } from './env'
import { createDatabase } from './index'

async function main() {
  if (!process.stdin.isTTY) {
    throw new Error('Database reset requires an interactive terminal.')
  }

  const confirmed = await consola.prompt('Are you sure you want to reset the database? All data will be deleted.', {
    type: 'confirm',
    initial: false,
    cancel: 'null',
  })

  if (confirmed !== true) {
    consola.info('Aborting...')
    return
  }

  const databaseUrl = new URL(ENV.DATABASE_URL)

  if (!['localhost', '127.0.0.1', '[::1]'].includes(databaseUrl.hostname)) {
    const nonLocalConfirmed = await consola.prompt('Non-local database detected. Are you sure you want to continue?', {
      type: 'confirm',
      initial: false,
      cancel: 'null',
    })

    if (nonLocalConfirmed !== true) {
      consola.info('Aborting...')
      return
    }
  }

  const directory = new URL('../', import.meta.url)
  const migrationsDirectory = new URL('migrations/', import.meta.url)
  const migrations = existsSync(migrationsDirectory) ? await readdir(migrationsDirectory, { recursive: true }) : []
  const hasMigrations = migrations.some((file) => file.endsWith('.sql'))
  const db = createDatabase()

  try {
    consola.info('Resetting database schemas...')
    await db.transaction(async (tx) => {
      await tx.execute(sql`
        DROP SCHEMA IF EXISTS public CASCADE;
        DROP SCHEMA IF EXISTS drizzle CASCADE;
        CREATE SCHEMA public;
        GRANT ALL ON SCHEMA public TO CURRENT_USER;
        GRANT ALL ON SCHEMA public TO public;
      `)
    })

    consola.info(hasMigrations ? 'Migrating database...' : 'No SQL migrations found. Applying the current schema...')
    await execa('pnpm', [hasMigrations ? 'db:migrate' : 'db:push'], { cwd: directory, stdio: 'inherit' })

    consola.info('Seeding database...')
    await execa('pnpm', ['db:seed'], { cwd: directory, stdio: 'inherit' })

    consola.success('Database reset successfully!')
  } finally {
    await db.$client.end()
  }
}

await main().catch((error: unknown) => {
  consola.error('Error resetting database:', error)

  if (error instanceof AggregateError) {
    for (const cause of error.errors) consola.error(cause)
  }

  process.exitCode = 1
})
