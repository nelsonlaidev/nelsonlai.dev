import type { Database } from '@repo/db'
import type { SocialProviders } from 'better-auth'

import { drizzleAdapter } from '@better-auth/drizzle-adapter/relations-v2'
import * as schema from '@repo/db/schema/auth'
import { betterAuth } from 'better-auth'
import { admin, lastLoginMethod } from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

import { ENV } from './env'

function getSocialProviders(): SocialProviders {
  const providers: SocialProviders = {}

  if (ENV.GOOGLE_CLIENT_ID && ENV.GOOGLE_CLIENT_SECRET) {
    providers.google = {
      clientId: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
    }
  }

  if (ENV.GITHUB_CLIENT_ID && ENV.GITHUB_CLIENT_SECRET) {
    providers.github = {
      clientId: ENV.GITHUB_CLIENT_ID,
      clientSecret: ENV.GITHUB_CLIENT_SECRET,
    }
  }

  return providers
}

export function createAuth(database: Database) {
  return betterAuth({
    baseURL: ENV.BETTER_AUTH_URL,
    secret: ENV.BETTER_AUTH_SECRET,
    database: drizzleAdapter(database, {
      provider: 'pg',
      schema,
      usePlural: true,
    }),
    trustedOrigins: [ENV.BETTER_AUTH_URL],
    socialProviders: getSocialProviders(),
    plugins: [admin(), lastLoginMethod({ storeInDatabase: true }), tanstackStartCookies()],
  })
}

export type Session = ReturnType<typeof createAuth>['$Infer']['Session']
