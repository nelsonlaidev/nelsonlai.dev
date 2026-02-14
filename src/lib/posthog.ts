import type { NextConfig } from 'next'

import { withPostHogConfig } from '@posthog/nextjs-config'
import { PostHog } from 'posthog-node'

import { env } from './env'

let posthogInstance: PostHog | null = null

export function getPostHogServer() {
  if (!env.NEXT_PUBLIC_POSTHOG_KEY) {
    throw new Error('POSTHOG_KEY is not set')
  }

  posthogInstance ??= new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
    host: env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  })

  return posthogInstance
}

export function withPostHog(nextConfig: Promise<NextConfig>): Promise<NextConfig> | NextConfig {
  if (!env.POSTHOG_API_KEY || !env.POSTHOG_ENV_ID || !env.NEXT_PUBLIC_POSTHOG_HOST) {
    return nextConfig
  }

  return withPostHogConfig(async () => nextConfig, {
    personalApiKey: env.POSTHOG_API_KEY,
    envId: env.POSTHOG_ENV_ID,
    host: env.NEXT_PUBLIC_POSTHOG_HOST,
  })
}
