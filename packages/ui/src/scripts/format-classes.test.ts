import { describe, it } from 'vitest'

import { expectTransformedEqual } from '@/test-utils/expect-transformed-equal'

import { formatClasses } from './format-classes'

describe('formatClasses', () => {
  describe('multiple groups - wraps in cn()', () => {
    it('wraps className with multiple groups in cn()', async () => {
      await expectTransformedEqual(
        `
        const Component = () => {
          return <div className='border-b last:border-b-0' />
        }
        `,
        `
        const Component = () => {
          return <div className={cn('border-b', 'last:border-b-0')} />
        }
        `,
        formatClasses
      )
    })

    it('wraps className with variant modifiers in cn()', async () => {
      await expectTransformedEqual(
        `
        const Component = () => {
          return <div className='flex items-center hover:bg-accent' />
        }
        `,
        `
        const Component = () => {
          return <div className={cn('flex items-center', 'hover:bg-accent')} />
        }
        `,
        formatClasses
      )
    })

    it('wraps className with data attributes in cn()', async () => {
      await expectTransformedEqual(
        `
        const Component = () => {
          return <div className='p-4 data-[state=open]:bg-accent' />
        }
        `,
        `
        const Component = () => {
          return <div className={cn('p-4', 'data-[state=open]:bg-accent')} />
        }
        `,
        formatClasses
      )
    })

    it('wraps className with responsive modifiers in cn()', async () => {
      await expectTransformedEqual(
        `
        const Component = () => {
          return <div className='text-sm md:text-base' />
        }
        `,
        `
        const Component = () => {
          return <div className={cn('text-sm', 'md:text-base')} />
        }
        `,
        formatClasses
      )
    })

    it('wraps className with dark mode modifiers in cn()', async () => {
      await expectTransformedEqual(
        `
        const Component = () => {
          return <div className='bg-white dark:bg-black' />
        }
        `,
        `
        const Component = () => {
          return <div className={cn('bg-white', 'dark:bg-black')} />
        }
        `,
        formatClasses
      )
    })

    it('handles multiple elements with different groupings', async () => {
      await expectTransformedEqual(
        `
        const Component = () => {
          return (
            <>
              <div className='border-b last:border-b-0' />
              <span className='text-sm hover:text-accent' />
            </>
          )
        }
        `,
        `
        const Component = () => {
          return (
            <>
              <div className={cn('border-b', 'last:border-b-0')} />
              <span className={cn('text-sm', 'hover:text-accent')} />
            </>
          )
        }
        `,
        formatClasses
      )
    })
  })

  describe('single group - leaves unchanged', () => {
    it('leaves single group className unchanged', async () => {
      await expectTransformedEqual(
        `
        const Component = () => {
          return <div className='flex items-center gap-4' />
        }
        `,
        `
        const Component = () => {
          return <div className='flex items-center gap-4' />
        }
        `,
        formatClasses
      )
    })

    it('leaves single class unchanged', async () => {
      await expectTransformedEqual(
        `
        const Component = () => {
          return <div className='container' />
        }
        `,
        `
        const Component = () => {
          return <div className='container' />
        }
        `,
        formatClasses
      )
    })

    it('leaves multiple base classes unchanged', async () => {
      await expectTransformedEqual(
        `
        const Component = () => {
          return <div className='flex flex-col items-center justify-center gap-4 p-8' />
        }
        `,
        `
        const Component = () => {
          return <div className='flex flex-col items-center justify-center gap-4 p-8' />
        }
        `,
        formatClasses
      )
    })
  })

  describe('non-matching patterns', () => {
    it('ignores className with cn() already', async () => {
      await expectTransformedEqual(
        `
        const Component = () => {
          return <div className={cn('flex', 'hover:bg-accent')} />
        }
        `,
        `
        const Component = () => {
          return <div className={cn('flex', 'hover:bg-accent')} />
        }
        `,
        formatClasses
      )
    })

    it('ignores className with template literals', async () => {
      await expectTransformedEqual(
        `
        const Component = () => {
          return <div className={\`flex \${isActive ? 'active' : ''}\`} />
        }
        `,
        `
        const Component = () => {
          return <div className={\`flex \${isActive ? 'active' : ''}\`} />
        }
        `,
        formatClasses
      )
    })

    it('ignores className with expressions', async () => {
      await expectTransformedEqual(
        `
        const Component = () => {
          return <div className={someVariable} />
        }
        `,
        `
        const Component = () => {
          return <div className={someVariable} />
        }
        `,
        formatClasses
      )
    })

    it('ignores other attributes', async () => {
      await expectTransformedEqual(
        `
        const Component = () => {
          return <div id='test' data-testid='component' />
        }
        `,
        `
        const Component = () => {
          return <div id='test' data-testid='component' />
        }
        `,
        formatClasses
      )
    })

    it('ignores non-JSX code', async () => {
      await expectTransformedEqual(
        `
        const className = 'border-b last:border-b-0'
        const obj = { className: 'flex items-center' }
        `,
        `
        const className = 'border-b last:border-b-0'
        const obj = { className: 'flex items-center' }
        `,
        formatClasses
      )
    })
  })

  describe('edge cases', () => {
    it('handles empty className', async () => {
      await expectTransformedEqual(
        `
        const Component = () => {
          return <div className='' />
        }
        `,
        `
        const Component = () => {
          return <div className='' />
        }
        `,
        formatClasses
      )
    })

    it('handles className with only whitespace', async () => {
      await expectTransformedEqual(
        `
        const Component = () => {
          return <div className='   ' />
        }
        `,
        `
        const Component = () => {
          return <div className='   ' />
        }
        `,
        formatClasses
      )
    })

    it('handles className with extra whitespace', async () => {
      await expectTransformedEqual(
        `
        const Component = () => {
          return <div className='border-b  last:border-b-0' />
        }
        `,
        `
        const Component = () => {
          return <div className={cn('border-b', 'last:border-b-0')} />
        }
        `,
        formatClasses
      )
    })

    it('handles empty file', async () => {
      await expectTransformedEqual(
        `
        `,
        `
        `,
        formatClasses
      )
    })

    it('handles file with no JSX', async () => {
      await expectTransformedEqual(
        `
        const myFunction = () => {
          return 'hello'
        }
        `,
        `
        const myFunction = () => {
          return 'hello'
        }
        `,
        formatClasses
      )
    })

    it('handles nested JSX elements', async () => {
      await expectTransformedEqual(
        `
        const Component = () => {
          return (
            <div className='container'>
              <header className='border-b last:border-b-0'>
                <h1 className='text-2xl font-bold'>Title</h1>
              </header>
            </div>
          )
        }
        `,
        `
        const Component = () => {
          return (
            <div className='container'>
              <header className={cn('border-b', 'last:border-b-0')}>
                <h1 className='text-2xl font-bold'>Title</h1>
              </header>
            </div>
          )
        }
        `,
        formatClasses
      )
    })

    it('handles self-closing tags', async () => {
      await expectTransformedEqual(
        `
        const Component = () => {
          return <input className='border-b focus:border-accent' />
        }
        `,
        `
        const Component = () => {
          return <input className={cn('border-b', 'focus:border-accent')} />
        }
        `,
        formatClasses
      )
    })

    it('preserves other JSX attributes', async () => {
      await expectTransformedEqual(
        `
        const Component = () => {
          return (
            <div
              id='test'
              className='border-b last:border-b-0'
              data-testid='component'
              data-slot='test'
              onClick={handleClick}
            />
          )
        }
        `,
        `
        const Component = () => {
          return (
            <div
              id='test'
              className={cn('border-b', 'last:border-b-0')}
              data-testid='component'
              data-slot='test'
              onClick={handleClick}
            />
          )
        }
        `,
        formatClasses
      )
    })
  })

  describe('complex grouping scenarios', () => {
    it('handles multiple variant chains', async () => {
      await expectTransformedEqual(
        `
        const Component = () => {
          return <div className='p-4 hover:bg-accent focus:ring-2 data-[state=open]:opacity-100 data-[state=closed]:opacity-0' />
        }
        `,
        `
        const Component = () => {
          return (
            <div
              className={cn(
                'p-4',
                'hover:bg-accent',
                'focus:ring-2',
                'data-[state=open]:opacity-100',
                'data-[state=closed]:opacity-0'
              )}
            />
          )
        }
        `,
        formatClasses
      )
    })

    it('handles arbitrary values with modifiers', async () => {
      await expectTransformedEqual(
        `
        const Component = () => {
          return <div className='w-[200px] hover:w-[250px]' />
        }
        `,
        `
        const Component = () => {
          return <div className={cn('w-[200px]', 'hover:w-[250px]')} />
        }
        `,
        formatClasses
      )
    })

    it('handles group modifiers', async () => {
      await expectTransformedEqual(
        `
        const Component = () => {
          return <div className='group-hover:opacity-100 peer-disabled:opacity-50' />
        }
        `,
        `
        const Component = () => {
          return <div className={cn('peer-disabled:opacity-50', 'group-hover:opacity-100')} />
        }
        `,
        formatClasses
      )
    })
  })
})
