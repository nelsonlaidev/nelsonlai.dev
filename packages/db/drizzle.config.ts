import 'varlock/auto-load'

import { defineConfig } from 'drizzle-kit'

import { ENV } from './src/env'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema/index.ts',
  out: './src/migrations',
  dbCredentials: {
    url: ENV.DATABASE_URL,
  },
})
