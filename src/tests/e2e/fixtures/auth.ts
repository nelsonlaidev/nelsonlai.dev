import { createHmac } from 'node:crypto'

import { ENV } from '@/env'

export const TEST_USER = {
  name: 'Test User',
  email: 'test-user@nelsonlai.dev',
  emailVerified: false,
  image: 'https://avatars.githubusercontent.com/u/583231?v=4',
  sessionToken: '00000000000000000000000000000000',
  accountId: '00000000',
}

export const TEST_UNIQUE_ID = '0'

export function createSessionCookie(token: string, expiresAt: Date) {
  const signature = createHmac('sha256', ENV.BETTER_AUTH_SECRET).update(token).digest('base64')

  return {
    name: 'better-auth.session_token',
    value: encodeURIComponent(`${token}.${signature}`),
    domain: 'localhost',
    path: '/',
    httpOnly: true,
    secure: false,
    sameSite: 'Lax' as const,
    expires: Math.floor(expiresAt.getTime() / 1000),
  }
}
