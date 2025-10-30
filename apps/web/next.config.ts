import type { NextConfig } from 'next'

import { withContentCollections } from '@content-collections/next'
import bundleAnalyzer from '@next/bundle-analyzer'
import { env } from '@repo/env'
import createNextIntlPlugin from 'next-intl/plugin'

import { IS_PRODUCTION } from '@/lib/constants'
import { withPostHog } from '@/lib/posthog'

const withNextIntl = createNextIntlPlugin()

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

const remotePatterns: NonNullable<NextConfig['images']>['remotePatterns'] = [
  {
    protocol: 'https',
    hostname: 'avatars.githubusercontent.com'
  },
  {
    protocol: 'https',
    hostname: '**.googleusercontent.com'
  }
]

if (!IS_PRODUCTION) {
  remotePatterns.push({
    protocol: 'http',
    hostname: 'localhost'
  })
}

if (env.CLOUDFLARE_R2_PUBLIC_URL) {
  const { hostname } = new URL(env.CLOUDFLARE_R2_PUBLIC_URL)

  remotePatterns.push({
    protocol: 'https',
    hostname
  })
}

const config: NextConfig = {
  productionBrowserSourceMaps: true,

  typescript: {
    ignoreBuildErrors: !!process.env.CI
  },

  images: {
    qualities: [75, 100],
    remotePatterns
  },

  skipTrailingSlashRedirect: true,

  // eslint-disable-next-line @typescript-eslint/require-await -- Must be async
  async rewrites() {
    return [
      {
        source: '/_ph/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*'
      },
      {
        source: '/_ph/:path*',
        destination: 'https://us.i.posthog.com/:path*'
      }
    ]
  },

  // eslint-disable-next-line @typescript-eslint/require-await -- Must be async
  async redirects() {
    return [
      {
        source: '/pc-specs',
        destination: '/uses',
        permanent: true
      },
      {
        source: '/atom',
        destination: '/rss.xml',
        permanent: true
      },
      {
        source: '/feed',
        destination: '/rss.xml',
        permanent: true
      },
      {
        source: '/rss',
        destination: '/rss.xml',
        permanent: true
      }
    ]
  },

  // eslint-disable-next-line @typescript-eslint/require-await -- Must be async
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ]
  }
}

export default withPostHog(withContentCollections(withNextIntl(withBundleAnalyzer(config))))
