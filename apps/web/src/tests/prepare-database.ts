import './env'

import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

import { ENV } from '@/env'

const databaseUrl = new URL(ENV.DATABASE_URL)
if (
  databaseUrl.hostname !== 'localhost' ||
  databaseUrl.port !== '5433' ||
  databaseUrl.pathname !== '/nelsonlaidev_test'
) {
  throw new Error('Refusing to prepare a database outside the dedicated local test service')
}
const directory = new URL('../../../../packages/db/', import.meta.url)
const result = spawnSync(
  process.execPath,
  [
    '--import',
    fileURLToPath(new URL('node_modules/tsx/dist/loader.mjs', directory)),
    '--import',
    fileURLToPath(new URL('env.ts', import.meta.url)),
    fileURLToPath(new URL('node_modules/drizzle-kit/bin.cjs', directory)),
    'push',
    '--force',
  ],
  { cwd: fileURLToPath(directory), stdio: 'inherit', env: process.env },
)
if (result.error) throw result.error
if (result.status !== 0) throw new Error(`Test database preparation failed with exit status ${result.status}`)
