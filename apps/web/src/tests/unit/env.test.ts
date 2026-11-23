import { describe, expect, test } from 'vitest'

import { ENV } from '@/env'

describe('environment initialization', () => {
  test('loads the test environment before application modules', () => {
    expect.assertions(2)

    expect(ENV.NODE_ENV).toBe('test')
    expect(process.env.NODE_ENV).toBe('test')
  })
})
