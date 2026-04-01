import type { NextConfig } from 'next'

import { withPostHogConfig } from '@posthog/nextjs-config'

import { env } from '../env'
import { getPostHogHost } from './posthog-config'

export function withPostHog(nextConfig: Promise<NextConfig> | NextConfig): Promise<NextConfig> | NextConfig {
  const host = getPostHogHost()

  if (!env.POSTHOG_API_KEY || !env.POSTHOG_ENV_ID || !host) {
    return nextConfig
  }

  return withPostHogConfig(async () => nextConfig, {
    personalApiKey: env.POSTHOG_API_KEY,
    envId: env.POSTHOG_ENV_ID,
    host,
  })
}
