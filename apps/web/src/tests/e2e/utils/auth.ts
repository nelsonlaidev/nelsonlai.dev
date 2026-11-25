import { createHmac } from 'node:crypto'

import { ENV } from '@/env'

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
