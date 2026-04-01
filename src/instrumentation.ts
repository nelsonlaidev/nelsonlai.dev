import type { Instrumentation } from 'next'

import { captureServerException } from '@/lib/posthog'

export function register() {
  // Do nothing
}

export function onRequestError(...args: Parameters<Instrumentation.onRequestError>) {
  const [error, request] = args

  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const headers = new Headers()

  for (const [key, value] of Object.entries(request.headers)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item) headers.append(key, item)
      }
      continue
    }

    if (value) {
      headers.append(key, value)
    }
  }

  captureServerException(
    error,
    {
      headers,
    },
    {
      source: 'next_request',
    },
  )
}
