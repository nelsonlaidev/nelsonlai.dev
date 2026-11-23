import type { Meta, StoryObj } from '@storybook/react-vite'

import { Separator } from '@repo/ui/components/separator'

const meta = {
  title: 'Components/Separator',
} satisfies Meta

export default meta

type Story = StoryObj

export const Orientations: Story = {
  render: () => (
    <div className='max-w-md space-y-6'>
      <p>First section</p>
      <Separator />
      <p>Second section</p>
      <div className='flex h-8 items-center gap-4'>
        <span>Overview</span>
        <Separator orientation='vertical' />
        <span>Details</span>
      </div>
    </div>
  ),
}
