import { createCsrfMiddleware, createMiddleware, createStart } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'

import { ENV } from './env'

function getContentSecurityPolicy() {
  const appSources = ["'self'", ENV.UMAMI_URL && new URL(ENV.UMAMI_URL).origin].filter(Boolean).join(' ')
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
    `script-src ${appSources} 'unsafe-inline' 'unsafe-eval'`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imageSources}`,
    "font-src 'self'",
    `connect-src ${appSources}`,
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

const securityMiddleware = createMiddleware().server(async ({ next }) => {
  setResponseHeader('X-Frame-Options', 'DENY')

  if (import.meta.env.PROD) {
    setResponseHeader('Content-Security-Policy', getContentSecurityPolicy())
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
