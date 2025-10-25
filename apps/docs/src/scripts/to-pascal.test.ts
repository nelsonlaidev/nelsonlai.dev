import { describe, expect, it } from 'vitest'

import { toPascal } from './to-pascal'

describe('toPascal', () => {
  it('converts kebab-case to PascalCase', () => {
    expect(toPascal('hello-world')).toBe('HelloWorld')
  })

  it('converts snake_case to PascalCase', () => {
    expect(toPascal('hello_world')).toBe('HelloWorld')
  })

  it('handles mixed delimiters', () => {
    expect(toPascal('hello-world_test')).toBe('HelloWorldTest')
  })

  it('handles single word', () => {
    expect(toPascal('hello')).toBe('Hello')
  })

  it('handles multiple consecutive delimiters', () => {
    expect(toPascal('hello--world')).toBe('HelloWorld')
  })

  it('handles leading delimiter', () => {
    expect(toPascal('-hello-world')).toBe('HelloWorld')
  })

  it('handles trailing delimiter', () => {
    expect(toPascal('hello-world-')).toBe('HelloWorld')
  })

  it('handles empty string', () => {
    expect(toPascal('')).toBe('')
  })

  it('converts radix component names', () => {
    expect(toPascal('accordion')).toBe('Accordion')
    expect(toPascal('dropdown-menu')).toBe('DropdownMenu')
    expect(toPascal('hover-card')).toBe('HoverCard')
  })
})
