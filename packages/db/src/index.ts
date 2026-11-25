import { drizzle } from 'drizzle-orm/node-postgres'

import { ENV } from './env'
import { relations } from './relations'

export function createDatabase() {
  return drizzle(ENV.DATABASE_URL, { relations })
}

export type Database = ReturnType<typeof createDatabase>
