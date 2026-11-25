import { Button } from '@repo/ui/components/button'
import { Spinner } from '@repo/ui/components/spinner'

import preview from '../.storybook/preview'

const meta = preview.meta({
  title: 'Components/Spinner',
})

export const LabelsAndSizes = meta.story({
  render: () => (
    <div className='flex items-center gap-6'>
      <Spinner />
      <Spinner aria-label='Preparing preview' className='size-8' />
      <Button disabled aria-busy='true'>
        <Spinner aria-hidden='true' data-icon='inline-start' />
        Saving
      </Button>
    </div>
  ),
})
