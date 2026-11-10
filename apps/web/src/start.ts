import { createCsrfMiddleware, createMiddleware, createStart } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'

import { ENV } from './env'

function getContentSecurityPolicy() {
  const scriptSources = ["'self'", ENV.UMAMI_URL && new URL(ENV.UMAMI_URL).origin].filter(Boolean).join(' ')
  const connectSources = [scriptSources, ENV.CLOUDFLARE_R2_ENDPOINT && new URL(ENV.CLOUDFLARE_R2_ENDPOINT).origin]
    .filter(Boolean)
    .join(' ')
  const imageSources = [
    "'self'",
    'https://avatars.githubusercontent.com',
    'https://*.googleusercontent.com',
    ENV.CLOUDFLARE_R2_PUBLIC_URL && new URL(ENV.CLOUDFLARE_R2_PUBLIC_URL).origin,
  ]
    .filter(Boolean)
    .join(' ')

  return [
    "default-src 'none'",
    `script-src ${scriptSources} 'unsafe-inline' 'unsafe-eval'`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imageSources}`,
    "font-src 'self'",
    `connect-src ${connectSources}`,
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
  setResponseHeader('Referrer-Policy', 'no-referrer')
  setResponseHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  setResponseHeader('X-Content-Type-Options', 'nosniff')
  setResponseHeader('X-Frame-Options', 'DENY')

  if (request.method === 'GET' && request.headers.get('accept')?.includes('text/html')) {
    setResponseHeader('Cache-Control', 'private, no-store')
  }

  if (import.meta.env.PROD) {
    setResponseHeader('Content-Security-Policy', getContentSecurityPolicy())
    setResponseHeader('Strict-Transport-Security', 'max-age=31536000')
  }

  return next()
})

export const startInstance = createStart(() => ({
  requestMiddleware: [
    securityMiddleware,
    createCsrfMiddleware({
      filter: (context) => context.handlerType === 'serverFn',
    }),
  ],
}))
