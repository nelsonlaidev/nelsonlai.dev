// cspell:ignore Élodie Durand, lodie
import { describe, expect, test } from 'vitest'

import { getInitials } from './get-initials'

describe('getInitials', () => {
  test.each([
    { name: 'Nelson', expected: 'N' },
    { name: 'Nelson Lai', expected: 'NL' },
    { name: 'Nelson Middle Lai', expected: 'NM' },
    { name: 'nelson lai', expected: 'nl' },
    { name: ' Nelson  Lai ', expected: 'NL' },
    { name: '', expected: '' },
    { name: '   ', expected: '' },
    { name: 'Jean-Luc Picard', expected: 'JP' },
    { name: 'Élodie Durand', expected: 'ÉD' },
    { name: 'E\u0301lodie Durand', expected: 'E\u0301D' },
    { name: '王 小明', expected: '王小' },
    { name: '𠮷田 太郎', expected: '𠮷太' },
    { name: '👩🏽‍💻 Lai', expected: '👩🏽‍💻L' },
  ])('returns "$expected" for "$name"', ({ name, expected }) => {
    expect(getInitials(name)).toBe(expected)
  })
})
