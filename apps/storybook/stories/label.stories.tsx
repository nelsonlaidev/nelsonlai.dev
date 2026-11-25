import { Input } from '@repo/ui/components/input'
import { Label } from '@repo/ui/components/label'

import preview from '../.storybook/preview'

const meta = preview.meta({
  title: 'Components/Label',
})

export const AssociatedControl = meta.story({
  render: () => (
    <div className='max-w-sm space-y-2'>
      <Label htmlFor='label-name'>Display name</Label>
      <Input id='label-name' placeholder='Enter a display name' />
    </div>
  ),
})
