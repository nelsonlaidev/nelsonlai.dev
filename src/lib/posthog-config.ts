import type { Rewrite } from 'next/dist/lib/load-custom-routes'

import { env } from '../env'

function trimTrailingSlash(value: string) {
  return value.replace(/\/$/, '')
}

export function getPostHogHost() {
  return env.NEXT_PUBLIC_POSTHOG_HOST ? trimTrailingSlash(env.NEXT_PUBLIC_POSTHOG_HOST) : undefined
}

export function isPostHogEnabled() {
  return Boolean(env.NEXT_PUBLIC_POSTHOG_KEY && getPostHogHost())
}

export function getBrowserPostHogHost() {
  return isPostHogEnabled() ? '/_ph' : undefined
}

function getPostHogAssetHost() {
  const host = getPostHogHost()
  if (!host) return

  const assetUrl = new URL(host)

  if (assetUrl.hostname.endsWith('.i.posthog.com')) {
    assetUrl.hostname = assetUrl.hostname.replace('.i.posthog.com', '-assets.i.posthog.com')
  }

  return trimTrailingSlash(assetUrl.toString())
}

export function getPostHogProxyRewrites(): Rewrite[] {
  const host = getPostHogHost()
  const assetHost = getPostHogAssetHost()

  if (!host || !assetHost) return []

  return [
    {
      source: '/_ph/static/:path*',
      destination: `${assetHost}/static/:path*`,
    },
    {
      source: '/_ph/:path*',
      destination: `${host}/:path*`,
    },
  ]
}

export function getPostHogAllowedOrigins() {
  const host = getPostHogHost()
  const assetHost = getPostHogAssetHost()

  return [host, assetHost].flatMap((value) => {
    if (!value) return []

    try {
      return [new URL(value).origin]
    } catch {
      return []
    }
  })
}
