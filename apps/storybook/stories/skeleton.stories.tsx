import { Skeleton } from '@repo/ui/components/skeleton'

import preview from '../.storybook/preview'

const meta = preview.meta({
  title: 'Components/Skeleton',
})

export const Content = meta.story({
  render: () => (
    <div aria-busy='true' className='flex max-w-sm gap-4'>
      <output className='sr-only'>Loading profile</output>
      <Skeleton className='size-12 shrink-0 rounded-full' />
      <div className='flex-1 space-y-3'>
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-1/2' />
      </div>
    </div>
  ),
})
