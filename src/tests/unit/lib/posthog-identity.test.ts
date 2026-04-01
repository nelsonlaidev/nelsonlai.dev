import { describe, expect, test } from 'vitest'

import { getDistinctIdFromPostHogCookie, getRouteContextFromHeaders } from '@/lib/posthog-identity'

describe('posthog identity helpers', () => {
  test('parses the distinct id from a PostHog cookie', () => {
    const cookiePayload = encodeURIComponent(JSON.stringify({ distinct_id: 'anon_123' }))
    const cookieHeader = `other=value; ph_phc_test_posthog=${cookiePayload}; another=1`

    expect(getDistinctIdFromPostHogCookie(cookieHeader)).toBe('anon_123')
  })

  test('extracts pathname and locale from the referer header', () => {
    const headers = new Headers({ referer: 'https://nelsonlai.dev/ja/blog/posthog-guide?foo=bar' })

    expect(getRouteContextFromHeaders(headers)).toEqual({
      pathname: '/ja/blog/posthog-guide',
      locale: 'ja',
    })
  })
})
