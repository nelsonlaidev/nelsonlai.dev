import { defineConfig } from 'drizzle-kit'

import { env } from './src/lib/env'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schemas/index.ts',
  dbCredentials: {
    url: env.DATABASE_URL
  },
  out: './src/migrations',
  strict: true,
  verbose: true
})
