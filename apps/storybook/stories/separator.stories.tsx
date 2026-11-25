import { Separator } from '@repo/ui/components/separator'

import preview from '../.storybook/preview'

const meta = preview.meta({
  title: 'Components/Separator',
})

export const Orientations = meta.story({
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
})
