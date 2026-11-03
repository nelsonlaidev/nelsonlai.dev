import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@repo/ui/components/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@repo/ui/components/tooltip'

const meta = {
  title: 'Overlays and feedback/Tooltip',
  parameters: {
    docs: {
      description: {
        component:
          'Import TooltipProvider, Tooltip, TooltipTrigger, and TooltipContent from @repo/ui/components/tooltip. Tooltips supplement an already labelled control. Keep interactive content in a Popover instead. Provider controls hover delay; keyboard focus also reveals the hint.',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj

export const Positions: Story = {
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
}

export const LongText: Story = {
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
}
