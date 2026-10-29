import { getAnonymousKey } from '@repo/api/lib/anonymous-key'
import { describe, expect, test } from 'vitest'

describe('anonymous client identity', () => {
  test('uses the trusted Cloudflare IP and rejects invalid values', () => {
    const first = new Headers({ 'cf-connecting-ip': '198.51.100.23' })
    expect(getAnonymousKey(first)).toBe(getAnonymousKey(first))
    expect(getAnonymousKey(first)).not.toBe(getAnonymousKey(new Headers({ 'cf-connecting-ip': '198.51.100.24' })))
    expect(getAnonymousKey(new Headers({ 'cf-connecting-ip': 'invalid' }))).toBe(getAnonymousKey(new Headers()))
  })
})
