import type { Meta, StoryObj } from '@storybook/react-vite'

import { Logo } from '@repo/ui/components/logo'

const meta = {
  title: 'Data and display/Logo',
  parameters: {
    docs: {
      description: {
        component:
          'Import { Logo } from @repo/ui/components/logo. The mark inherits currentColor. Hide a decorative logo from assistive technology; label standalone brand links.',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj

export const SizesAndSurfaces: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-8'>
      <Logo aria-label='Seafold' className='w-8' />
      <Logo aria-label='Seafold' className='w-16 text-primary' />
      <div className='rounded-lg bg-foreground p-6 text-background'>
        <Logo aria-label='Seafold' className='w-20' />
      </div>
    </div>
  ),
}
