import type { SocialProviders } from 'better-auth'
import type { NextRequest } from 'next/server'

import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { headers } from 'next/headers'

import { db } from '@/db'
import { ENV } from '@/env'
import { getBaseUrl } from '@/utils/get-base-url'

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

export const auth = betterAuth({
  baseURL: getBaseUrl(),
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
  }),
  trustedOrigins: [getBaseUrl()],
  socialProviders: getSocialProviders(),
  user: {
    additionalFields: {
      role: { type: 'string', required: true, input: false, defaultValue: 'user' },
    },
  },
})

export async function getSession(request?: NextRequest) {
  return auth.api.getSession({
    headers: request ? request.headers : await headers(),
  })
}
