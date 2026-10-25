import type { Database } from '@repo/db'
import type { SocialProviders } from 'better-auth'

import { drizzleAdapter } from '@better-auth/drizzle-adapter/relations-v2'
import * as schema from '@repo/db/schema/auth'
import { betterAuth } from 'better-auth'

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
    database: drizzleAdapter(database, {
      provider: 'pg',
      schema,
      usePlural: true,
    }),
    trustedOrigins: [ENV.BETTER_AUTH_URL],
    socialProviders: getSocialProviders(),
    user: {
      additionalFields: {
        role: {
          type: ['user', 'admin'],
          required: false,
          defaultValue: 'user',
          input: false,
        },
      },
    },
  })
}

export type Session = ReturnType<typeof createAuth>['$Infer']['Session']
