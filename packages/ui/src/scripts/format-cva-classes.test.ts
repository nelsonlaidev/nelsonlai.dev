import { describe, it } from 'vitest'

import { expectTransformedEqual } from '@/test-utils/expect-transformed-equal'

import { formatCvaClasses } from './format-cva-classes'

describe('formatCvaClasses', () => {
  describe('converts base string to array with grouping', () => {
    it('groups mixed variant chains in cva base', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: 'flex items-center hover:bg-red-500 last:border-b-0' })
        `,
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: ['flex items-center', 'hover:bg-red-500', 'last:border-b-0'] })
        `,
        formatCvaClasses
      )
    })

    it('converts single group to array', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: 'flex items-center gap-4' })
        `,
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: ['flex items-center gap-4'] })
        `,
        formatCvaClasses
      )
    })

    it('groups data attributes separately', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: 'p-4 bg-white data-[state=open]:bg-accent data-[state=closed]:opacity-0' })
        `,
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: ['p-4 bg-white', 'data-[state=open]:bg-accent', 'data-[state=closed]:opacity-0'] })
        `,
        formatCvaClasses
      )
    })

    it('groups responsive modifiers separately', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: 'text-sm md:text-base lg:text-lg' })
        `,
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: ['text-sm', 'md:text-base', 'lg:text-lg'] })
        `,
        formatCvaClasses
      )
    })

    it('groups dark mode modifiers separately', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: 'bg-white text-black dark:bg-black dark:text-white' })
        `,
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: ['bg-white text-black', 'dark:bg-black dark:text-white'] })
        `,
        formatCvaClasses
      )
    })

    it('handles multiple cva() calls in same file', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: 'border-b last:border-b-0' })
        const cardVariants = cva({ base: 'text-sm hover:text-accent' })
        `,
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: ['border-b', 'last:border-b-0'] })
        const cardVariants = cva({ base: ['text-sm', 'hover:text-accent'] })
        `,
        formatCvaClasses
      )
    })
  })

  describe('handles cva with variants', () => {
    it('processes base while preserving variants', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const buttonVariants = cva({
          base: 'flex items-center hover:bg-accent',
          variants: {
            size: {
              sm: 'text-sm',
              md: 'text-base'
            }
          }
        })
        `,
        `
        import { cva } from 'cva'

        const buttonVariants = cva({
          base: ['flex items-center', 'hover:bg-accent'],
          variants: {
            size: {
              sm: 'text-sm',
              md: 'text-base'
            }
          }
        })
        `,
        formatCvaClasses
      )
    })

    it('processes base while preserving defaultVariants', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const buttonVariants = cva({
          base: 'flex items-center hover:bg-accent',
          variants: {
            size: {
              sm: 'text-sm',
              md: 'text-base'
            }
          },
          defaultVariants: {
            size: 'md'
          }
        })
        `,
        `
        import { cva } from 'cva'

        const buttonVariants = cva({
          base: ['flex items-center', 'hover:bg-accent'],
          variants: {
            size: {
              sm: 'text-sm',
              md: 'text-base'
            }
          },
          defaultVariants: {
            size: 'md'
          }
        })
        `,
        formatCvaClasses
      )
    })

    it('processes base while preserving compoundVariants', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const buttonVariants = cva({
          base: 'flex items-center hover:bg-accent',
          variants: {
            size: {
              sm: 'text-sm',
              md: 'text-base'
            },
            variant: {
              primary: 'bg-blue-500',
              secondary: 'bg-gray-500'
            }
          },
          compoundVariants: [
            {
              size: 'sm',
              variant: 'primary',
              class: 'font-bold'
            }
          ]
        })
        `,
        `
        import { cva } from 'cva'

        const buttonVariants = cva({
          base: ['flex items-center', 'hover:bg-accent'],
          variants: {
            size: {
              sm: 'text-sm',
              md: 'text-base'
            },
            variant: {
              primary: 'bg-blue-500',
              secondary: 'bg-gray-500'
            }
          },
          compoundVariants: [
            {
              size: 'sm',
              variant: 'primary',
              class: 'font-bold'
            }
          ]
        })
        `,
        formatCvaClasses
      )
    })
  })

  describe('handles template literals', () => {
    it('processes template literal base strings', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: \`flex items-center hover:bg-accent\` })
        `,
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: ['flex items-center', 'hover:bg-accent'] })
        `,
        formatCvaClasses
      )
    })
  })

  describe('only processes cva from cva import', () => {
    it('ignores cva() from other imports', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'some-other-library'

        const buttonVariants = cva({ base: 'border-b last:border-b-0' })
        `,
        `
        import { cva } from 'some-other-library'

        const buttonVariants = cva({ base: 'border-b last:border-b-0' })
        `,
        formatCvaClasses
      )
    })

    it('ignores cva() without import', async () => {
      await expectTransformedEqual(
        `
        const buttonVariants = cva({ base: 'border-b last:border-b-0' })
        `,
        `
        const buttonVariants = cva({ base: 'border-b last:border-b-0' })
        `,
        formatCvaClasses
      )
    })

    it('processes only cva from correct import when multiple cva imports exist', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'
        import { cva as otherCva } from 'other-library'

        const buttonVariants = cva({ base: 'border-b last:border-b-0' })
        const cardVariants = otherCva({ base: 'flex hover:bg-accent' })
        `,
        `
        import { cva } from 'cva'
        import { cva as otherCva } from 'other-library'

        const buttonVariants = cva({ base: ['border-b', 'last:border-b-0'] })
        const cardVariants = otherCva({ base: 'flex hover:bg-accent' })
        `,
        formatCvaClasses
      )
    })
  })

  describe('edge cases', () => {
    it('handles empty base string', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: '' })
        `,
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: '' })
        `,
        formatCvaClasses
      )
    })

    it('handles whitespace-only base string', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: '   ' })
        `,
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: '   ' })
        `,
        formatCvaClasses
      )
    })

    it('handles extra whitespace between classes', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: 'border-b  last:border-b-0' })
        `,
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: ['border-b', 'last:border-b-0'] })
        `,
        formatCvaClasses
      )
    })

    it('handles empty file', async () => {
      await expectTransformedEqual(
        `
        `,
        `
        `,
        formatCvaClasses
      )
    })

    it('handles file without cva() calls', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const Component = () => {
          return <div className='flex items-center' />
        }
        `,
        `
        import { cva } from 'cva'

        const Component = () => {
          return <div className='flex items-center' />
        }
        `,
        formatCvaClasses
      )
    })

    it('handles cva without base property', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const buttonVariants = cva({
          variants: {
            size: {
              sm: 'text-sm',
              md: 'text-base'
            }
          }
        })
        `,
        `
        import { cva } from 'cva'

        const buttonVariants = cva({
          variants: {
            size: {
              sm: 'text-sm',
              md: 'text-base'
            }
          }
        })
        `,
        formatCvaClasses
      )
    })

    it('handles cva with base as non-string', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: ['flex', 'items-center'] })
        `,
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: ['flex', 'items-center'] })
        `,
        formatCvaClasses
      )
    })

    it('handles cva with single class', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: 'container' })
        `,
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: ['container'] })
        `,
        formatCvaClasses
      )
    })

    it('handles multiple cva calls with different structures', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: 'flex items-center hover:bg-accent' })
        const cardVariants = cva({
          base: 'p-4 border last:border-b-0',
          variants: {
            size: {
              sm: 'text-sm',
              md: 'text-base'
            }
          }
        })
        const iconVariants = cva({ base: 'size-4' })
        `,
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: ['flex items-center', 'hover:bg-accent'] })
        const cardVariants = cva({
          base: ['p-4 border', 'last:border-b-0'],
          variants: {
            size: {
              sm: 'text-sm',
              md: 'text-base'
            }
          }
        })
        const iconVariants = cva({ base: ['size-4'] })
        `,
        formatCvaClasses
      )
    })
  })

  describe('complex grouping scenarios', () => {
    it('handles multiple variant chains with multiple classes each', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const buttonVariants = cva({
          base: 'p-4 bg-white hover:bg-accent hover:text-white focus:ring-2 focus:ring-blue-500 data-[state=open]:opacity-100 data-[state=open]:scale-100'
        })
        `,
        `
        import { cva } from 'cva'

        const buttonVariants = cva({
          base: [
            'p-4 bg-white',
            'hover:bg-accent hover:text-white',
            'focus:ring-2 focus:ring-blue-500',
            'data-[state=open]:opacity-100 data-[state=open]:scale-100'
          ]
        })
        `,
        formatCvaClasses
      )
    })

    it('handles arbitrary values with modifiers', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: 'w-[200px] h-[100px] hover:w-[250px] hover:h-[150px]' })
        `,
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: ['w-[200px] h-[100px]', 'hover:w-[250px] hover:h-[150px]'] })
        `,
        formatCvaClasses
      )
    })

    it('handles group and peer modifiers', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const buttonVariants = cva({
          base: 'opacity-50 group-hover:opacity-100 peer-disabled:opacity-25 group-data-[disabled=true]:cursor-not-allowed'
        })
        `,
        `
        import { cva } from 'cva'

        const buttonVariants = cva({
          base: [
            'opacity-50',
            'peer-disabled:opacity-25',
            'group-data-[disabled=true]:cursor-not-allowed',
            'group-hover:opacity-100'
          ]
        })
        `,
        formatCvaClasses
      )
    })

    it('handles complex selector modifiers', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const buttonVariants = cva({
          base: 'text-base [&>svg]:size-4 [&>svg]:shrink-0 [&_svg]:pointer-events-none'
        })
        `,
        `
        import { cva } from 'cva'

        const buttonVariants = cva({
          base: ['text-base', '[&>svg]:size-4 [&>svg]:shrink-0', '[&_svg]:pointer-events-none']
        })
        `,
        formatCvaClasses
      )
    })

    it('handles first and last pseudo-classes', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: 'border-b first:border-t last:border-b-0' })
        `,
        `
        import { cva } from 'cva'

        const buttonVariants = cva({ base: ['border-b', 'first:border-t', 'last:border-b-0'] })
        `,
        formatCvaClasses
      )
    })

    it('handles all common state modifiers', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const buttonVariants = cva({
          base: 'bg-white hover:bg-gray-100 focus:ring-2 active:bg-gray-200 disabled:opacity-50 aria-disabled:cursor-not-allowed'
        })
        `,
        `
        import { cva } from 'cva'

        const buttonVariants = cva({
          base: [
            'bg-white',
            'hover:bg-gray-100',
            'active:bg-gray-200',
            'focus:ring-2',
            'aria-disabled:cursor-not-allowed',
            'disabled:opacity-50'
          ]
        })
        `,
        formatCvaClasses
      )
    })
  })

  describe('real-world examples', () => {
    it('handles button component variants', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const buttonVariants = cva({
          base: 'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
          variants: {
            variant: {
              default: 'bg-primary text-primary-foreground hover:bg-primary/90',
              destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
              outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
            },
            size: {
              default: 'h-10 px-4 py-2',
              sm: 'h-9 rounded-md px-3',
              lg: 'h-11 rounded-md px-8'
            }
          },
          defaultVariants: {
            variant: 'default',
            size: 'default'
          }
        })
        `,
        `
        import { cva } from 'cva'

        const buttonVariants = cva({
          base: [
            'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2',
            'disabled:pointer-events-none disabled:opacity-50'
          ],
          variants: {
            variant: {
              default: 'bg-primary text-primary-foreground hover:bg-primary/90',
              destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
              outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
            },
            size: {
              default: 'h-10 px-4 py-2',
              sm: 'h-9 rounded-md px-3',
              lg: 'h-11 rounded-md px-8'
            }
          },
          defaultVariants: {
            variant: 'default',
            size: 'default'
          }
        })
        `,
        formatCvaClasses
      )
    })

    it('handles card component variants', async () => {
      await expectTransformedEqual(
        `
        import { cva } from 'cva'

        const cardVariants = cva({
          base: 'rounded-lg border bg-card text-card-foreground shadow-sm data-[state=open]:animate-in data-[state=closed]:animate-out'
        })
        `,
        `
        import { cva } from 'cva'

        const cardVariants = cva({
          base: [
            'rounded-lg border bg-card text-card-foreground shadow-sm',
            'data-[state=open]:animate-in',
            'data-[state=closed]:animate-out'
          ]
        })
        `,
        formatCvaClasses
      )
    })
  })
})
