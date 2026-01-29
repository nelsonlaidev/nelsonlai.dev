import { env } from '@repo/env'
import { defineConfig } from 'drizzle-kit'

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
