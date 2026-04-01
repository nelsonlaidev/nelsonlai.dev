import posthog from 'posthog-js'

import { env } from '@/env'
import { getBrowserPostHogHost } from '@/lib/posthog-config'

const browserPostHogHost = getBrowserPostHogHost()

if (env.NEXT_PUBLIC_POSTHOG_KEY && browserPostHogHost) {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: browserPostHogHost,
    defaults: '2025-05-24',
    autocapture: false,
    capture_exceptions: false,
    capture_pageview: 'history_change',
    capture_pageleave: 'if_capture_pageview',
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: '[data-posthog-mask]',
      blockSelector: '[data-posthog-block]',
    },
  })
}
