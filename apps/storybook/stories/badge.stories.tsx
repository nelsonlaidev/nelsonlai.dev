import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from '@repo/ui/components/badge'
import { CheckIcon } from 'lucide-react'

const meta = {
  title: 'Data and display/Badge',
  parameters: {
    docs: {
      description: {
        component:
          'Import { Badge, badgeVariants } from @repo/ui/components/badge. Supports render composition for links. A badge is a label, not an interactive control unless composed with one.',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj

export const Variants: Story = {
  render: () => (
    <div className='flex flex-wrap gap-3'>
      {(['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const).map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className='flex flex-wrap gap-3'>
      <Badge>
        <CheckIcon aria-hidden='true' data-icon='inline-start' />
        Published
      </Badge>
      <Badge render={<a href='#badge-destination' />} variant='outline'>
        Local link
      </Badge>
      <Badge aria-invalid='true'>Invalid</Badge>
    </div>
  ),
}
