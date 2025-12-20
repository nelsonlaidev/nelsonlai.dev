import type { NextRequest } from 'next/server'

import { db } from '@repo/db'
import { env } from '@repo/env'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { headers } from 'next/headers'

import { getBaseUrl } from '@/utils/get-base-url'

export const auth = betterAuth({
  baseURL: getBaseUrl(),
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true
  }),
  trustedOrigins: [getBaseUrl()],
  socialProviders: {
    ...(!!env.GOOGLE_CLIENT_ID &&
      !!env.GOOGLE_CLIENT_SECRET && {
        google: {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET
        }
      }),
    ...(!!env.GITHUB_CLIENT_ID &&
      !!env.GITHUB_CLIENT_SECRET && {
        github: {
          clientId: env.GITHUB_CLIENT_ID,
          clientSecret: env.GITHUB_CLIENT_SECRET
        }
      })
  },
  user: {
    additionalFields: {
      role: { type: 'string', required: true, input: false, defaultValue: 'user' }
    }
  }
})

export async function getSession(request?: NextRequest) {
  return auth.api.getSession({
    headers: request ? request.headers : await headers()
  })
}
