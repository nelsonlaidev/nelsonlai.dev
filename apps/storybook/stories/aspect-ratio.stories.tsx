import type { Meta, StoryObj } from '@storybook/react-vite'

import { AspectRatio } from '@repo/ui/components/aspect-ratio'

const meta = {
  title: 'Structure and navigation/Aspect ratio',
  parameters: {
    docs: {
      description: {
        component:
          'Import { AspectRatio } from @repo/ui/components/aspect-ratio. Set a numeric ratio; the child can fill the reserved space without shifting layout.',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj

export const Ratios: Story = {
  render: () => (
    <div className='grid max-w-3xl gap-6 sm:grid-cols-3'>
      {[16 / 9, 1, 3 / 4].map((ratio) => (
        <AspectRatio key={ratio} ratio={ratio} className='overflow-hidden rounded-lg border'>
          <img src='/reef.svg' alt='Illustrated reef' className='size-full object-cover' />
        </AspectRatio>
      ))}
    </div>
  ),
}
