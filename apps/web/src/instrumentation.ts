import type { Instrumentation } from 'next'

import { env } from '@repo/env'

export const register = () => {
  // Do nothing
}

export const onRequestError: Instrumentation.onRequestError = async (error, request) => {
  if (process.env.NEXT_RUNTIME === 'nodejs' && env.NEXT_PUBLIC_POSTHOG_KEY) {
    const { getPostHogServer } = await import('./lib/posthog')
    const posthog = getPostHogServer()

    let distinctId: string | undefined
    if (request.headers.cookie) {
      const cookieString = Array.isArray(request.headers.cookie)
        ? request.headers.cookie.join('; ')
        : request.headers.cookie

      const postHogCookieMatch = /ph_phc_.*?_posthog=([^;]+)/.exec(cookieString)

      if (postHogCookieMatch?.[1]) {
        try {
          const decodedCookie = decodeURIComponent(postHogCookieMatch[1])
          const postHogData = JSON.parse(decodedCookie)
          distinctId = postHogData.distinct_id
        } catch (parseError) {
          console.error('Error parsing PostHog cookie:', parseError)
        }
      }
    }

    posthog.captureException(error, distinctId)
  }
}
