import type { Meta, StoryObj } from '@storybook/react-vite'

import { Input } from '@repo/ui/components/input'
import { Label } from '@repo/ui/components/label'

const meta = {
  title: 'Components/Label',
} satisfies Meta

export default meta

type Story = StoryObj

export const AssociatedControl: Story = {
  render: () => (
    <div className='max-w-sm space-y-2'>
      <Label htmlFor='label-name'>Display name</Label>
      <Input id='label-name' placeholder='Enter a display name' />
    </div>
  ),
}
