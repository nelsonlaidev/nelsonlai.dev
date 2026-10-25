import { drizzle } from 'drizzle-orm/node-postgres'

import { ENV } from './env'

export function createDatabase() {
  return drizzle(ENV.DATABASE_URL)
}

export type Database = ReturnType<typeof createDatabase>
