import handler, { createServerEntry } from '@tanstack/react-start/server-entry'

import { ENV } from './env'
import { deLocalizeUrl, isLocale } from './paraglide/runtime'
import { paraglideMiddleware } from './paraglide/server'

const externalOrigins = [ENV.UMAMI_URL, ENV.CLOUDFLARE_R2_ENDPOINT, ENV.CLOUDFLARE_R2_PUBLIC_URL]
  .filter((url): url is string => Boolean(url))
  .map((url) => new URL(url).origin)
  .join(' ')

const contentSecurityPolicy = [
  "default-src 'none'",
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.nelsonlai.dev ${externalOrigins}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: https://avatars.githubusercontent.com https://*.googleusercontent.com https://github.com https://images.unsplash.com ${externalOrigins}`,
  "font-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'self'",
  `connect-src 'self' https://*.nelsonlai.dev ${externalOrigins} ${import.meta.env.DEV ? 'ws: wss:' : ''}`,
  "media-src 'self'",
  "manifest-src 'self'",
  `frame-ancestors 'self' ${import.meta.env.DEV ? 'http://localhost:3002' : ''}`,
].join('; ')

const redirects: Record<string, string> = {
  '/pc-specs': '/uses',
  '/atom': '/rss.xml',
  '/feed': '/rss.xml',
  '/rss': '/rss.xml',
}

export default createServerEntry({
  async fetch(request) {
    const response = await paraglideMiddleware(request, async () => {
      const url = new URL(request.url)
      const pathname = deLocalizeUrl(url).pathname.replace(/\/$/, '') || '/'
      const destination = redirects[pathname]
      if (destination) {
        const firstSegment = url.pathname.split('/')[1]
        const prefix = firstSegment && isLocale(firstSegment) ? `/${firstSegment}` : ''
        url.pathname = `${prefix}${destination}`
        return Response.redirect(url, 308)
      }
      // Router rewrites localize URLs itself; preserve the original URL to avoid redirect loops.
      return handler.fetch(request)
    })

    const headers = new Headers(response.headers)
    headers.set('Content-Security-Policy', contentSecurityPolicy)
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    headers.set('X-Content-Type-Options', 'nosniff')
    if (import.meta.env.PROD) headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
  },
})
