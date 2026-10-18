import 'varlock/auto-load'

import { defineConfig } from 'drizzle-kit'

import { ENV } from '@/env'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schemas/index.ts',
  out: './src/db/migrations',
  dbCredentials: {
    url: ENV.DATABASE_URL,
  },
  strict: true,
  verbose: true,
})
