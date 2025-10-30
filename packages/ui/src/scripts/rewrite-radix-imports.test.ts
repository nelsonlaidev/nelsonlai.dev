import { describe, it } from 'vitest'

import { expectTransformedEqual } from '@/test-utils/expect-transformed-equal'

import { rewriteRadixImports } from './rewrite-radix-imports'

describe('rewriteRadixImports', () => {
  describe('namespace imports', () => {
    it('rewrites namespace import with proper alias', async () => {
      await expectTransformedEqual(
        `
        import * as AccordionPrimitive from '@radix-ui/react-accordion'
        `,
        `
        import { Accordion as AccordionPrimitive } from 'radix-ui'
        `,
        rewriteRadixImports
      )
    })

    it('handles multiple namespace imports', async () => {
      await expectTransformedEqual(
        `
        import * as AccordionPrimitive from '@radix-ui/react-accordion'
        import * as DialogPrimitive from '@radix-ui/react-dialog'
        import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
        `,
        `
        import { Accordion as AccordionPrimitive } from 'radix-ui'
        import { Dialog as DialogPrimitive } from 'radix-ui'
        import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui'
        `,
        rewriteRadixImports
      )
    })
  })

  describe('non-radix imports', () => {
    it('ignores non-radix imports', async () => {
      await expectTransformedEqual(
        `
        import React from 'react'
        `,
        `
        import React from 'react'
        `,
        rewriteRadixImports
      )
    })

    it('ignores non-radix dynamic imports', async () => {
      await expectTransformedEqual(
        `
        const module = await import('some-other-package')
        `,
        `
        const module = await import('some-other-package')
        `,
        rewriteRadixImports
      )
    })
  })
})
