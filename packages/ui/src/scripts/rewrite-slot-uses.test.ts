import { describe, it } from 'vitest'

import { expectTransformedEqual } from '@/test-utils/expect-transformed-equal'

import { rewriteSlotUses } from './rewrite-slot-uses'

describe('rewriteSlotUses', () => {
  describe('basic slot usage', () => {
    it('rewrites Slot to Slot.Root in JSX', async () => {
      await expectTransformedEqual(
        `
        import { Slot } from '@radix-ui/react-slot'

        const Component = () => {
          return <Slot>content</Slot>
        }
        `,
        `
        import { Slot } from '@radix-ui/react-slot'

        const Component = () => {
          return <Slot.Root>content</Slot.Root>
        }
        `,
        rewriteSlotUses
      )
    })

    it('rewrites multiple Slot usages', async () => {
      await expectTransformedEqual(
        `
        import { Slot } from '@radix-ui/react-slot'

        const Component = () => {
          return (
            <>
              <Slot>first</Slot>
              <Slot>second</Slot>
            </>
          )
        }
        `,
        `
        import { Slot } from '@radix-ui/react-slot'

        const Component = () => {
          return (
            <>
              <Slot.Root>first</Slot.Root>
              <Slot.Root>second</Slot.Root>
            </>
          )
        }
        `,
        rewriteSlotUses
      )
    })

    it('rewrites self-closing Slot elements', async () => {
      await expectTransformedEqual(
        `
        import { Slot } from '@radix-ui/react-slot'

        const Component = () => {
          return <Slot />
        }
        `,
        `
        import { Slot } from '@radix-ui/react-slot'

        const Component = () => {
          return <Slot.Root />
        }
        `,
        rewriteSlotUses
      )
    })
  })

  describe('conditional rendering', () => {
    it('rewrites Slot in ternary expressions', async () => {
      await expectTransformedEqual(
        `
        import { Slot } from '@radix-ui/react-slot'

        const Component = ({ asChild }: { asChild: boolean }) => {
          const Comp = asChild ? Slot : 'button'
          return <Comp>content</Comp>
        }
        `,
        `
        import { Slot } from '@radix-ui/react-slot'

        const Component = ({ asChild }: { asChild: boolean }) => {
          const Comp = asChild ? Slot.Root : 'button'
          return <Comp>content</Comp>
        }
        `,
        rewriteSlotUses
      )
    })
  })

  describe('preserves import specifiers', () => {
    it('does not modify Slot in import statements', async () => {
      await expectTransformedEqual(
        `
        import { Slot } from '@radix-ui/react-slot'
        `,
        `
        import { Slot } from '@radix-ui/react-slot'
        `,
        rewriteSlotUses
      )
    })

    it('does not modify Slot in aliased imports', async () => {
      await expectTransformedEqual(
        `
        import { Slot as SlotPrimitive } from '@radix-ui/react-slot'
        `,
        `
        import { Slot as SlotPrimitive } from '@radix-ui/react-slot'
        `,
        rewriteSlotUses
      )
    })
  })

  describe('preserves property access expressions', () => {
    it('does not modify already transformed Slot.Root', async () => {
      await expectTransformedEqual(
        `
        import { Slot } from '@radix-ui/react-slot'

        const Component = () => {
          return <Slot.Root>content</Slot.Root>
        }
        `,
        `
        import { Slot } from '@radix-ui/react-slot'

        const Component = () => {
          return <Slot.Root>content</Slot.Root>
        }
        `,
        rewriteSlotUses
      )
    })

    it('does not modify other Slot properties', async () => {
      await expectTransformedEqual(
        `
        import { Slot } from '@radix-ui/react-slot'

        const Component = () => {
          return <Slot.Custom>content</Slot.Custom>
        }
        `,
        `
        import { Slot } from '@radix-ui/react-slot'

        const Component = () => {
          return <Slot.Custom>content</Slot.Custom>
        }
        `,
        rewriteSlotUses
      )
    })
  })

  describe('preserves variable declarations', () => {
    it('does not modify Slot variable names', async () => {
      await expectTransformedEqual(
        `
        const Slot = () => <div>custom slot</div>
        `,
        `
        const Slot = () => <div>custom slot</div>
        `,
        rewriteSlotUses
      )
    })
  })

  describe('edge cases', () => {
    it('handles file with no Slot usage', async () => {
      await expectTransformedEqual(
        `
        const Component = () => {
          return <div>content</div>
        }
        `,
        `
        const Component = () => {
          return <div>content</div>
        }
        `,
        rewriteSlotUses
      )
    })

    it('handles mixed usage patterns', async () => {
      await expectTransformedEqual(
        `
        import { Slot } from '@radix-ui/react-slot'

        const Component = ({ asChild }: { asChild: boolean }) => {
          const Comp = asChild ? Slot : 'div'
          return (
            <>
              <Comp>first</Comp>
              <Slot>second</Slot>
              <Slot.Root>third</Slot.Root>
            </>
          )
        }
        `,
        `
        import { Slot } from '@radix-ui/react-slot'

        const Component = ({ asChild }: { asChild: boolean }) => {
          const Comp = asChild ? Slot.Root : 'div'
          return (
            <>
              <Comp>first</Comp>
              <Slot.Root>second</Slot.Root>
              <Slot.Root>third</Slot.Root>
            </>
          )
        }
        `,
        rewriteSlotUses
      )
    })
  })
})
