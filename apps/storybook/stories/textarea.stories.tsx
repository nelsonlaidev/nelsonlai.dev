import { Label } from '@repo/ui/components/label'
import { Textarea } from '@repo/ui/components/textarea'

import preview from '../.storybook/preview'

const meta = preview.meta({
  title: 'Components/Textarea',
})

export const States = meta.story({
  render: () => (
    <div className='grid max-w-3xl gap-6 sm:grid-cols-2'>
      <div className='space-y-2'>
        <Label htmlFor='textarea-local'>Local note</Label>
        <Textarea id='textarea-local' placeholder='Write a longer note…' rows={4} />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='textarea-disabled'>Disabled</Label>
        <Textarea id='textarea-disabled' disabled defaultValue='Unavailable note' />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='textarea-readonly'>Read only</Label>
        <Textarea
          id='textarea-readonly'
          readOnly
          value='A longer read-only passage remains selectable and can wrap across multiple lines on a narrow screen.'
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='textarea-invalid'>Invalid note</Label>
        <Textarea id='textarea-invalid' aria-invalid='true' aria-describedby='textarea-error' />
        <p id='textarea-error' className='text-sm text-destructive'>
          A note is required.
        </p>
      </div>
    </div>
  ),
})
