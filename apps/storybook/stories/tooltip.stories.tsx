import { Button } from '@repo/ui/components/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@repo/ui/components/tooltip'

import preview from '../.storybook/preview'

const meta = preview.meta({
  title: 'Components/Tooltip',
})

export const Positions = meta.story({
  render: () => (
    <TooltipProvider delay={200}>
      <div className='flex flex-wrap gap-4 py-12'>
        {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger render={<Button variant='outline' />}>{side} hint</TooltipTrigger>
            <TooltipContent side={side}>A useful {side} hint</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
})

export const LongText = meta.story({
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button />}>Focus for details</TooltipTrigger>
        <TooltipContent className='max-w-64'>
          A longer explanation wraps naturally. It supplements this control and does not contain links, buttons, or
          other focusable content.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
})
