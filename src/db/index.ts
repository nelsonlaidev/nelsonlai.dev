import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { IS_PRODUCTION } from '@/constants/common'
import { ENV } from '@/env'

import * as schema from './schemas'

declare global {
  var pgClient: ReturnType<typeof postgres> | undefined
}

let client: ReturnType<typeof postgres>

if (IS_PRODUCTION) {
  client = postgres(ENV.DATABASE_URL)
} else {
  globalThis.pgClient ??= postgres(ENV.DATABASE_URL)
  client = globalThis.pgClient
}

export const db = drizzle(client, { schema })
