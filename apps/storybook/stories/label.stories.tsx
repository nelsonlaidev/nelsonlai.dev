import type { Meta, StoryObj } from '@storybook/react-vite'

import { Input } from '@repo/ui/components/input'
import { Label } from '@repo/ui/components/label'

const meta = {
  title: 'Actions and forms/Label',
  parameters: {
    docs: {
      description: {
        component:
          'Import { Label } from @repo/ui/components/label. Connect htmlFor to a unique control id. Keep visible labels even when a control has a placeholder.',
      },
    },
  },
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
