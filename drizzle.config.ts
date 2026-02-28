import { defineConfig } from 'drizzle-kit'

import { env } from './src/env'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schemas/index.ts',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  out: './src/db/migrations',
  strict: true,
  verbose: true,
})
