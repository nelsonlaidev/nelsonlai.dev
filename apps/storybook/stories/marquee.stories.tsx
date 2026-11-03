import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from '@repo/ui/components/badge'
import { Marquee } from '@repo/ui/components/marquee'

const meta = {
  title: 'Data and display/Marquee',
  parameters: {
    docs: {
      description: {
        component:
          'Import { Marquee } from @repo/ui/components/marquee. Supports left/up directions, reverse, duration, gap, pauseOnHover, and fading. Reduced motion stops movement and hides the duplicate copy. Keep items decorative or noninteractive because the implementation duplicates its children.',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj

const items = ['React', 'TypeScript', 'Tailwind', 'Base UI', 'Ark UI']

export const Horizontal: Story = {
  render: () => (
    <Marquee className='max-w-xl' duration={20} gap='2rem'>
      {items.map((item) => (
        <Badge key={item} variant='outline'>
          {item}
        </Badge>
      ))}
    </Marquee>
  ),
}

export const VerticalReversed: Story = {
  render: () => (
    <Marquee direction='up' reverse fade={false} pauseOnHover={false} duration={12} className='h-48 max-w-xs'>
      {items.map((item) => (
        <p key={item} className='rounded-md border p-3'>
          {item}
        </p>
      ))}
    </Marquee>
  ),
}
