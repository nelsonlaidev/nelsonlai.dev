import { describe, expect, it } from 'vitest'

import { getIp } from '@/utils/get-ip'

describe('getIp', () => {
  it('returns the first IP from the x-forwarded-for header', () => {
    const headers = new Headers({
      'x-forwarded-for': '203.0.113.4, 70.41.3.18, 150.172.238.178'
    })

    expect(getIp(headers)).toBe('203.0.113.4')
  })

  it('falls back to the x-real-ip header when x-forwarded-for is missing', () => {
    const headers = new Headers({ 'x-real-ip': '198.51.100.23' })

    expect(getIp(headers)).toBe('198.51.100.23')
  })

  it('returns a default value when no headers are present', () => {
    expect(getIp(new Headers())).toBe('0.0.0.0')
  })
})
