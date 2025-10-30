import { describe, it } from 'vitest'

import { expectTransformedEqual } from '@/test-utils/expect-transformed-equal'

import { rewriteCvaImports } from './rewrite-cva-imports'

describe('rewriteCvaImports', () => {
  describe('cva imports from class-variance-authority', () => {
    it('rewrites single cva import', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'class-variance-authority'
        `,
        `
        import { cva } from 'cva'
        `,
        rewriteCvaImports
      )
    })

    it('rewrites cva import with VariantProps', async () => {
      await expectTransformedEqual(
        `
        import { cva, type VariantProps } from 'class-variance-authority'
        `,
        `
        import { cva, type VariantProps } from 'cva'
        `,
        rewriteCvaImports
      )
    })

    it('rewrites cva import with multiple named imports', async () => {
      await expectTransformedEqual(
        `
        import { cva, cx, type VariantProps } from 'class-variance-authority'
        `,
        `
        import { cva, cx, type VariantProps } from 'cva'
        `,
        rewriteCvaImports
      )
    })

    it('handles multiple class-variance-authority imports', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'class-variance-authority'
        import { type VariantProps } from 'class-variance-authority'
        `,
        `
        import { cva } from 'cva'
        import { type VariantProps } from 'cva'
        `,
        rewriteCvaImports
      )
    })
  })

  describe('non-matching imports', () => {
    it('ignores imports from other packages', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'some-other-package'
        `,
        `
        import { cva } from 'some-other-package'
        `,
        rewriteCvaImports
      )
    })

    it('ignores imports from similar but different packages', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'class-variance-authority-v2'
        `,
        `
        import { cva } from 'class-variance-authority-v2'
        `,
        rewriteCvaImports
      )
    })

    it('preserves other imports while rewriting cva', async () => {
      await expectTransformedEqual(
        `
        import React from 'react'
        import { cva } from 'class-variance-authority'
        import { cn } from '@repo/ui/utils/cn'
        `,
        `
        import React from 'react'
        import { cva } from 'cva'
        import { cn } from '@repo/ui/utils/cn'
        `,
        rewriteCvaImports
      )
    })
  })

  describe('edge cases', () => {
    it('handles file with no imports', async () => {
      await expectTransformedEqual(`const x = 1`, `const x = 1`, rewriteCvaImports)
    })

    it('handles file with only non-matching imports', async () => {
      await expectTransformedEqual(
        `
        import React from 'react'
        import { Button } from './button'
        `,
        `
        import React from 'react'
        import { Button } from './button'
        `,
        rewriteCvaImports
      )
    })

    it('handles aliased imports', async () => {
      await expectTransformedEqual(
        `
        import { cva as createVariant } from 'class-variance-authority'
        `,
        `
        import { cva as createVariant } from 'cva'
        `,
        rewriteCvaImports
      )
    })
  })
})
