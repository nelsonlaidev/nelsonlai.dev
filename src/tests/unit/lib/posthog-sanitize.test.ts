import { describe, expect, test } from 'vitest'

import { getErrorKind, sanitizeProperties } from '@/lib/posthog-sanitize'

describe('posthog sanitize helpers', () => {
  test('redacts known sensitive keys and keeps safe metadata', () => {
    expect(
      sanitizeProperties({
        body: 'secret response body',
        location: 'Hong Kong',
        status: 500,
        provider: 'github',
      }),
    ).toEqual({
      status: 500,
      provider: 'github',
    })
  })

  test('truncates long strings', () => {
    const result = sanitizeProperties({ value: 'x'.repeat(200) })

    expect(result.value).toHaveLength(160)
  })

  test('derives a stable error kind', () => {
    expect(getErrorKind(new TypeError('boom'))).toBe('TypeError')
    expect(getErrorKind('boom')).toBe('StringError')
  })
})
