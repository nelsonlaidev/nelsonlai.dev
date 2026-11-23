import { Logo } from '@repo/ui/components/logo'

import preview from '../.storybook/preview'

const meta = preview.meta({
  title: 'Components/Logo',
})

export const SizesAndSurfaces = meta.story({
  render: () => (
    <div className='flex flex-wrap items-center gap-8'>
      <Logo aria-label='Seafold' className='w-8' />
      <Logo aria-label='Seafold' className='w-16 text-primary' />
      <div className='rounded-lg bg-foreground p-6 text-background'>
        <Logo aria-label='Seafold' className='w-20' />
      </div>
    </div>
  ),
})
