import { describe, it } from 'vitest'

import { expectTransformedEqual } from '@/test-utils/expect-transformed-equal'

import { formatCnClasses } from './format-cn-classes'

describe('formatCnClasses', () => {
  describe('groups classes in cn() calls', () => {
    it('groups mixed variant chains in cn() call', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('border-b hover:border-blue-500 last:border-b-0')} />
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('border-b', 'hover:border-blue-500', 'last:border-b-0')} />
        }
        `,
        formatCnClasses
      )
    })

    it('groups base classes together and separates variants', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('flex items-center gap-4 hover:bg-red-500 focus:ring-2')} />
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('flex items-center gap-4', 'hover:bg-red-500', 'focus:ring-2')} />
        }
        `,
        formatCnClasses
      )
    })

    it('groups data attributes separately', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('p-4 bg-white data-[state=open]:bg-accent data-[state=closed]:opacity-0')} />
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('p-4 bg-white', 'data-[state=open]:bg-accent', 'data-[state=closed]:opacity-0')} />
        }
        `,
        formatCnClasses
      )
    })

    it('groups responsive modifiers separately', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('text-sm md:text-base lg:text-lg')} />
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('text-sm', 'md:text-base', 'lg:text-lg')} />
        }
        `,
        formatCnClasses
      )
    })

    it('groups dark mode modifiers separately', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('bg-white text-black dark:bg-black dark:text-white')} />
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('bg-white text-black', 'dark:bg-black dark:text-white')} />
        }
        `,
        formatCnClasses
      )
    })

    it('handles multiple cn() calls in same file', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return (
            <>
              <div className={cn('border-b last:border-b-0')} />
              <span className={cn('text-sm hover:text-accent')} />
            </>
          )
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return (
            <>
              <div className={cn('border-b', 'last:border-b-0')} />
              <span className={cn('text-sm', 'hover:text-accent')} />
            </>
          )
        }
        `,
        formatCnClasses
      )
    })
  })

  describe('handles multiple arguments in cn()', () => {
    it('processes each string argument separately', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('flex items-center', 'hover:bg-accent focus:ring-2')} />
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('flex items-center', 'hover:bg-accent', 'focus:ring-2')} />
        }
        `,
        formatCnClasses
      )
    })

    it('processes string arguments while preserving non-string arguments', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('flex items-center hover:bg-accent', isActive && 'active')} />
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('flex items-center', 'hover:bg-accent', isActive && 'active')} />
        }
        `,
        formatCnClasses
      )
    })

    it('handles template literals in cn()', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn(\`flex items-center hover:bg-accent\`)} />
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('flex items-center', 'hover:bg-accent')} />
        }
        `,
        formatCnClasses
      )
    })
  })

  describe('only processes cn from @repo/ui/utils/cn', () => {
    it('ignores cn() from other imports', async () => {
      await expectTransformedEqual(
        `
        import { cn } from 'some-other-library'

        const Component = () => {
          return <div className={cn('border-b last:border-b-0')} />
        }
        `,
        `
        import { cn } from 'some-other-library'

        const Component = () => {
          return <div className={cn('border-b last:border-b-0')} />
        }
        `,
        formatCnClasses
      )
    })

    it('ignores cn() without import', async () => {
      await expectTransformedEqual(
        `
        const Component = () => {
          return <div className={cn('border-b last:border-b-0')} />
        }
        `,
        `
        const Component = () => {
          return <div className={cn('border-b last:border-b-0')} />
        }
        `,
        formatCnClasses
      )
    })

    it('processes only cn from correct import when multiple cn imports exist', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'
        import { cn as otherCn } from 'other-library'

        const Component = () => {
          return (
            <>
              <div className={cn('border-b last:border-b-0')} />
              <div className={otherCn('flex hover:bg-accent')} />
            </>
          )
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'
        import { cn as otherCn } from 'other-library'

        const Component = () => {
          return (
            <>
              <div className={cn('border-b', 'last:border-b-0')} />
              <div className={otherCn('flex hover:bg-accent')} />
            </>
          )
        }
        `,
        formatCnClasses
      )
    })
  })

  describe('edge cases', () => {
    it('handles empty string in cn()', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('')} />
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('')} />
        }
        `,
        formatCnClasses
      )
    })

    it('handles whitespace-only string in cn()', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('   ')} />
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('   ')} />
        }
        `,
        formatCnClasses
      )
    })

    it('handles extra whitespace between classes', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('border-b  last:border-b-0')} />
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('border-b', 'last:border-b-0')} />
        }
        `,
        formatCnClasses
      )
    })

    it('handles empty file', async () => {
      await expectTransformedEqual(
        `
        `,
        `
        `,
        formatCnClasses
      )
    })

    it('handles file without cn() calls', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className='flex items-center' />
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className='flex items-center' />
        }
        `,
        formatCnClasses
      )
    })

    it('handles nested cn() calls', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return (
            <div className={cn('container')}>
              <header className={cn('border-b last:border-b-0')}>
                <h1 className={cn('text-2xl hover:text-accent')}>Title</h1>
              </header>
            </div>
          )
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return (
            <div className={cn('container')}>
              <header className={cn('border-b', 'last:border-b-0')}>
                <h1 className={cn('text-2xl', 'hover:text-accent')}>Title</h1>
              </header>
            </div>
          )
        }
        `,
        formatCnClasses
      )
    })

    it('handles cn() with only base classes', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('flex items-center gap-4')} />
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('flex items-center gap-4')} />
        }
        `,
        formatCnClasses
      )
    })

    it('handles cn() with single class', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('container')} />
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('container')} />
        }
        `,
        formatCnClasses
      )
    })
  })

  describe('complex grouping scenarios', () => {
    it('handles multiple variant chains with multiple classes each', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('p-4 bg-white hover:bg-accent hover:text-white focus:ring-2 focus:ring-blue-500 data-[state=open]:opacity-100 data-[state=open]:scale-100')} />
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return (
            <div
              className={cn(
                'p-4 bg-white',
                'hover:bg-accent hover:text-white',
                'focus:ring-2 focus:ring-blue-500',
                'data-[state=open]:opacity-100 data-[state=open]:scale-100'
              )}
            />
          )
        }
        `,
        formatCnClasses
      )
    })

    it('handles arbitrary values with modifiers', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('w-[200px] h-[100px] hover:w-[250px] hover:h-[150px]')} />
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('w-[200px] h-[100px]', 'hover:w-[250px] hover:h-[150px]')} />
        }
        `,
        formatCnClasses
      )
    })

    it('handles group and peer modifiers', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('opacity-50 group-hover:opacity-100 peer-disabled:opacity-25 group-data-[disabled=true]:cursor-not-allowed')} />
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return (
            <div
              className={cn(
                'opacity-50',
                'peer-disabled:opacity-25',
                'group-data-[disabled=true]:cursor-not-allowed',
                'group-hover:opacity-100'
              )}
            />
          )
        }
        `,
        formatCnClasses
      )
    })

    it('handles complex selector modifiers', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('text-base [&>svg]:size-4 [&>svg]:shrink-0 [&_svg]:pointer-events-none')} />
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('text-base', '[&>svg]:size-4 [&>svg]:shrink-0', '[&_svg]:pointer-events-none')} />
        }
        `,
        formatCnClasses
      )
    })

    it('handles first and last pseudo-classes', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('border-b first:border-t last:border-b-0')} />
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('border-b', 'first:border-t', 'last:border-b-0')} />
        }
        `,
        formatCnClasses
      )
    })
  })

  describe('preserves non-string arguments', () => {
    it('preserves conditional expressions', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('flex items-center', isActive && 'bg-accent', isDisabled && 'opacity-50')} />
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('flex items-center', isActive && 'bg-accent', isDisabled && 'opacity-50')} />
        }
        `,
        formatCnClasses
      )
    })

    it('preserves ternary expressions', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('flex items-center', isActive ? 'bg-accent' : 'bg-muted')} />
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('flex items-center', isActive ? 'bg-accent' : 'bg-muted')} />
        }
        `,
        formatCnClasses
      )
    })

    it('preserves variable references', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('flex items-center', customClasses)} />
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('flex items-center', customClasses)} />
        }
        `,
        formatCnClasses
      )
    })

    it('preserves object expressions', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('flex items-center', { 'bg-accent': isActive })} />
        }
        `,
        `
        import { cn } from '@repo/ui/utils/cn'

        const Component = () => {
          return <div className={cn('flex items-center', { 'bg-accent': isActive })} />
        }
        `,
        formatCnClasses
      )
    })
  })
})
