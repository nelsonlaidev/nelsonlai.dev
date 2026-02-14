import type { Instrumentation } from 'next'

import * as z from 'zod'

const PostHogCookieDataSchema = z.object({
  distinct_id: z.string(),
})

export function register() {
  // Do nothing
}

export async function onRequestError(...args: Parameters<Instrumentation.onRequestError>) {
  const [error, request] = args

  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
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
          const rawData = JSON.parse(decodedCookie)
          const postHogData = PostHogCookieDataSchema.parse(rawData)
          distinctId = postHogData.distinct_id
        } catch (parseError) {
          console.error('Error parsing PostHog cookie:', parseError)
        }
      }
    }

    posthog.captureException(error, distinctId)
  }
}
