import { describe, expect, test } from 'vitest'

import { createRange } from './create-range'

describe('createRange', () => {
  test.each([
    { length: 0, expected: [] },
    { length: 1, expected: [0] },
    { length: 5, expected: [0, 1, 2, 3, 4] },
    { length: -3, expected: [] },
    { length: 2.9, expected: [0, 1] },
  ])('returns $expected for length $length', ({ length, expected }) => {
    expect(createRange(length)).toEqual(expected)
  })
})
