import { Input } from '@repo/ui/components/input'
import { Label } from '@repo/ui/components/label'

import preview from '../.storybook/preview'

const meta = preview.meta({
  title: 'Components/Input',
})

export const States = meta.story({
  render: () => (
    <div className='grid max-w-xl gap-4 sm:grid-cols-2'>
      <div className='space-y-2'>
        <Label htmlFor='input-default'>Editable</Label>
        <Input id='input-default' placeholder='Write locally' />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='input-disabled'>Disabled</Label>
        <Input id='input-disabled' disabled defaultValue='Unavailable' />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='input-readonly'>Read only</Label>
        <Input id='input-readonly' readOnly value='Copyable value' />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='input-invalid'>Email</Label>
        <Input
          id='input-invalid'
          type='email'
          aria-invalid='true'
          aria-describedby='input-error'
          defaultValue='invalid'
        />
        <p id='input-error' className='text-sm text-destructive'>
          Enter a valid email address.
        </p>
      </div>
    </div>
  ),
})

export const Types = meta.story({
  render: () => (
    <div className='max-w-sm space-y-4'>
      <Input type='search' aria-label='Search locally' placeholder='Search' />
      <Input type='number' aria-label='Quantity' defaultValue={3} min={0} />
      <Input type='file' aria-label='Choose a local file' />
    </div>
  ),
})
