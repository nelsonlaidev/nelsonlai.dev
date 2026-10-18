import type { NextConfig } from 'next'

import { withContentCollections } from '@content-collections/next'
import { varlockNextConfigPlugin } from '@varlock/nextjs-integration/plugin'
import createNextIntlPlugin from 'next-intl/plugin'

import { ENV } from '@/env'

const withNextIntl = createNextIntlPlugin()
const withVarlock = varlockNextConfigPlugin()

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

if (ENV.NODE_ENV !== 'production') {
  remotePatterns.push({
    protocol: 'http',
    hostname: 'localhost',
  })
}

if (ENV.CLOUDFLARE_R2_PUBLIC_URL) {
  const { hostname } = new URL(ENV.CLOUDFLARE_R2_PUBLIC_URL)

  remotePatterns.push({
    protocol: 'https',
    hostname,
  })
}

const config: NextConfig = {
  reactCompiler: true,

  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },

  productionBrowserSourceMaps: true,

  typescript: {
    ignoreBuildErrors: ENV.CI,
  },

  images: {
    qualities: [75, 100],
    remotePatterns,
  },

  skipTrailingSlashRedirect: true,

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

export default withVarlock(async () => withContentCollections(withNextIntl(config)))
