import { env } from '@repo/env'
import posthog from 'posthog-js'

if (env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: '/_ph',
    defaults: '2025-05-24'
  })
}
