import { ScrollArea, ScrollBar } from '@repo/ui/components/scroll-area'

import preview from '../.storybook/preview'

const meta = preview.meta({
  title: 'Components/Scroll area',
})

export const BothAxes = meta.story({
  render: () => (
    <ScrollArea className='h-64 w-full max-w-md rounded-lg border'>
      <div className='w-160 space-y-4 p-4'>
        {Array.from({ length: 15 }, (_, index) => (
          <p key={index}>
            Row {index + 1} — This intentionally wide text demonstrates horizontal and vertical overflow.
          </p>
        ))}
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  ),
})
