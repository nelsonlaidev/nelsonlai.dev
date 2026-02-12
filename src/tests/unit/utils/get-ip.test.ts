import { describe, expect, test } from 'vitest'

import { getIp } from '@/utils/get-ip'

describe(getIp, () => {
  test('returns the ip from the x-real-ip header', () => {
    expect.assertions(1)

    const headers = new Headers({ 'x-real-ip': '198.51.100.23' })

    expect(getIp(headers)).toBe('198.51.100.23')
  })
})
