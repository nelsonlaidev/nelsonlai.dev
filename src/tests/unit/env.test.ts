import { ENV } from 'varlock/env'
import { describe, expect, test } from 'vitest'

import { IS_PRODUCTION } from '@/constants/common'

describe('environment initialization', () => {
  test('loads the test environment before application modules', () => {
    expect.assertions(3)

    expect(ENV.NODE_ENV).toBe('test')
    expect(process.env.NODE_ENV).toBe('test')
    expect(IS_PRODUCTION).toBe(false)
  })
})
