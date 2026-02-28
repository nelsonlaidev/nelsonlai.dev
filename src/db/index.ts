import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { env } from '@/env'
import { IS_PRODUCTION } from '@/lib/constants'

import * as schema from './schemas'

declare global {
  var pgClient: ReturnType<typeof postgres> | undefined
}

let client: ReturnType<typeof postgres>

if (IS_PRODUCTION) {
  client = postgres(env.DATABASE_URL)
} else {
  globalThis.pgClient ??= postgres(env.DATABASE_URL)
  client = globalThis.pgClient
}

export const db = drizzle(client, { schema })
