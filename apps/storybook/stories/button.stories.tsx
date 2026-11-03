import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button, outlineActionVariants } from '@repo/ui/components/button'
import { Spinner } from '@repo/ui/components/spinner'
import { ArrowRightIcon, PlusIcon } from 'lucide-react'

const meta = {
  title: 'Actions and forms/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'Import `{ Button, buttonVariants, outlineActionVariants }` from `@repo/ui/components/button`. Use native disabled state, label icon-only actions, and keep render elements self-closing. Sizes show the package defaults; the website adds its own 44px minimum control size.',
      },
    },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => (
    <div className='flex flex-wrap gap-3'>
      {(['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'] as const).map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-3'>
      {(['xs', 'sm', 'default', 'lg'] as const).map((size) => (
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
      {(['icon-xs', 'icon-sm', 'icon', 'icon-lg'] as const).map((size) => (
        <Button key={size} size={size} aria-label={`Add item (${size})`}>
          <PlusIcon aria-hidden='true' />
        </Button>
      ))}
    </div>
  ),
}

export const StatesAndComposition: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-3'>
      <Button disabled>Disabled</Button>
      <Button disabled aria-busy='true'>
        <Spinner />
        Saving locally
      </Button>
      <Button>
        <PlusIcon aria-hidden='true' data-icon='inline-start' />
        Add item
      </Button>
      <Button nativeButton={false} render={<a href='#local-destination' />}>
        Local link
        <ArrowRightIcon aria-hidden='true' data-icon='inline-end' />
      </Button>
      <Button className={outlineActionVariants()}>Outline action</Button>
      <Button className={outlineActionVariants({ hoverBorder: 'muted' })}>Muted action</Button>
    </div>
  ),
}
