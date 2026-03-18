import { defineConfig } from 'drizzle-kit'

import { env } from './src/env'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schemas/index.ts',
  out: './src/db/migrations',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  strict: true,
  verbose: true,
})
