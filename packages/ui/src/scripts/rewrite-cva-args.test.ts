import { describe, it } from 'vitest'

import { expectTransformedEqual } from '@/test-utils/expect-transformed-equal'

import { rewriteCvaArgs } from './rewrite-cva-args'

describe('rewriteCvaArgs', () => {
  describe('old API to beta API conversion', () => {
    it('rewrites cva with base string and config object', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'
        const buttonVariants = cva('base-class', {
          variants: {
            size: {
              sm: 'text-sm',
              lg: 'text-lg'
            }
          }
        })
        `,
        `
        import { cva } from 'cva'
        const buttonVariants = cva({
          base: 'base-class',
          variants: {
            size: {
              sm: 'text-sm',
              lg: 'text-lg'
            }
          }
        })
        `,
        rewriteCvaArgs
      )
    })

    it('rewrites cva with template literal base', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'
        const variants = cva(\`base-class\`, {
          variants: {}
        })
        `,
        `
        import { cva } from 'cva'
        const variants = cva({ base: \`base-class\`, variants: {} })
        `,
        rewriteCvaArgs
      )
    })

    it('rewrites cva with only base string (no variants)', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'
        const simple = cva('base-class', {})
        `,
        `
        import { cva } from 'cva'
        const simple = cva({ base: 'base-class' })
        `,
        rewriteCvaArgs
      )
    })

    it('rewrites multiple cva calls', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'
        const button = cva('btn', { variants: {} })
        const card = cva('card', { variants: {} })
        `,
        `
        import { cva } from 'cva'
        const button = cva({ base: 'btn', variants: {} })
        const card = cva({ base: 'card', variants: {} })
        `,
        rewriteCvaArgs
      )
    })
  })

  describe('non-matching patterns', () => {
    it('ignores cva calls with single argument', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'
        const variants = cva({ base: 'already-beta' })
        `,
        `
        import { cva } from 'cva'
        const variants = cva({ base: 'already-beta' })
        `,
        rewriteCvaArgs
      )
    })

    it('ignores cva calls with three or more arguments', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'
        const variants = cva('base', {}, {})
        `,
        `
        import { cva } from 'cva'
        const variants = cva('base', {}, {})
        `,
        rewriteCvaArgs
      )
    })

    it('ignores cva calls where first arg is not a string', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'
        const variants = cva(someVariable, {})
        `,
        `
        import { cva } from 'cva'
        const variants = cva(someVariable, {})
        `,
        rewriteCvaArgs
      )
    })

    it('ignores cva calls where second arg is not an object', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'
        const variants = cva('base', someVariable)
        `,
        `
        import { cva } from 'cva'
        const variants = cva('base', someVariable)
        `,
        rewriteCvaArgs
      )
    })

    it('ignores cva from different packages', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'other-package'
        const variants = cva('base', {})
        `,
        `
        import { cva } from 'other-package'
        const variants = cva('base', {})
        `,
        rewriteCvaArgs
      )
    })
  })

  describe('edge cases', () => {
    it('handles file with no cva calls', async () => {
      await expectTransformedEqual(`const x = 1`, `const x = 1`, rewriteCvaArgs)
    })

    it('preserves complex variant configurations', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'
        const complex = cva('base', {
          variants: {
            size: { sm: 'small', lg: 'large' },
            color: { red: 'text-red', blue: 'text-blue' }
          },
          defaultVariants: {
            size: 'sm'
          }
        })
        `,
        `
        import { cva } from 'cva'
        const complex = cva({
          base: 'base',
          variants: {
            size: { sm: 'small', lg: 'large' },
            color: { red: 'text-red', blue: 'text-blue' }
          },
          defaultVariants: {
            size: 'sm'
          }
        })
        `,
        rewriteCvaArgs
      )
    })
  })
})
