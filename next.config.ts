import type { NextConfig } from 'next'

import { withContentCollections } from '@content-collections/next'
import createNextIntlPlugin from 'next-intl/plugin'

import { env } from '@/env'
import { getPostHogProxyRewrites } from '@/lib/posthog-config'
import { withPostHog } from '@/lib/posthog-next'

import { IS_PRODUCTION } from './src/constants/common'

const withNextIntl = createNextIntlPlugin()

const remotePatterns: NonNullable<NextConfig['images']>['remotePatterns'] = [
  {
    protocol: 'https',
    hostname: 'avatars.githubusercontent.com',
  },
  {
    protocol: 'https',
    hostname: 'github.com',
  },
  {
    protocol: 'https',
    hostname: 'images.unsplash.com',
  },
  {
    protocol: 'https',
    hostname: '**.googleusercontent.com',
  },
]

if (!IS_PRODUCTION) {
  remotePatterns.push({
    protocol: 'http',
    hostname: 'localhost',
  })
}

if (env.CLOUDFLARE_R2_PUBLIC_URL) {
  const { hostname } = new URL(env.CLOUDFLARE_R2_PUBLIC_URL)

  remotePatterns.push({
    protocol: 'https',
    hostname,
  })
}

const config: NextConfig = {
  productionBrowserSourceMaps: true,

  typescript: {
    ignoreBuildErrors: env.CI,
  },

  images: {
    qualities: [75, 100],
    remotePatterns,
  },

  skipTrailingSlashRedirect: true,

  rewrites() {
    return getPostHogProxyRewrites()
  },

  redirects() {
    return [
      {
        source: '/pc-specs',
        destination: '/uses',
        permanent: true,
      },
      {
        source: '/atom',
        destination: '/rss.xml',
        permanent: true,
      },
      {
        source: '/feed',
        destination: '/rss.xml',
        permanent: true,
      },
      {
        source: '/rss',
        destination: '/rss.xml',
        permanent: true,
      },
    ]
  },

  headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

export default withPostHog(withContentCollections(withNextIntl(config)))
