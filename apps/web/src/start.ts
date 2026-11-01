import { randomBytes } from 'node:crypto'

import { createCsrfMiddleware, createMiddleware, createStart } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'

import { ENV } from './env'

function getContentSecurityPolicy(nonce: string) {
  const connectSrc = ["'self'", ENV.UMAMI_URL && new URL(ENV.UMAMI_URL).origin].filter(Boolean).join(' ')

  return [
    "default-src 'none'",
    `script-src 'nonce-${nonce}' 'strict-dynamic'`,
    "script-src-attr 'none'",
    `style-src 'self' 'nonce-${nonce}'`,
    "style-src-attr 'none'",
    "img-src 'self'",
    "font-src 'self'",
    `connect-src ${connectSrc}`,
    "media-src 'self'",
    "worker-src 'none'",
    "frame-src 'none'",
    "object-src 'none'",
    "manifest-src 'self'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(import.meta.env.PROD ? ['upgrade-insecure-requests'] : []),
  ].join('; ')
}

const securityMiddleware = createMiddleware().server(async ({ next, request }) => {
  const nonce = randomBytes(16).toString('base64')

  setResponseHeader('Referrer-Policy', 'no-referrer')
  setResponseHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  setResponseHeader('X-Content-Type-Options', 'nosniff')
  setResponseHeader('X-Frame-Options', 'DENY')

  if (request.method === 'GET' && request.headers.get('accept')?.includes('text/html')) {
    setResponseHeader('Cache-Control', 'private, no-store')
  }

  if (import.meta.env.PROD) {
    setResponseHeader('Content-Security-Policy', getContentSecurityPolicy(nonce))
    setResponseHeader('Strict-Transport-Security', 'max-age=31536000')
  }

  return next({ context: { nonce } })
})

export const startInstance = createStart(() => ({
  requestMiddleware: [
    securityMiddleware,
    createCsrfMiddleware({
      filter: (context) => context.handlerType === 'serverFn',
    }),
  ],
}))
