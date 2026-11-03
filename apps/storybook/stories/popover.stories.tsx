import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@repo/ui/components/button'
import { Input } from '@repo/ui/components/input'
import { Label } from '@repo/ui/components/label'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@repo/ui/components/popover'

const meta = {
  title: 'Overlays and feedback/Popover',
  parameters: {
    docs: {
      description: {
        component:
          'Import the Popover* parts from @repo/ui/components/popover. Content handles its portal and positioning. Side, alignment, offsets, and collision padding pass through. Use a dialog-like popover for interactive content.',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj

export const Positioned: Story = {
  render: () => (
    <div className='flex flex-wrap gap-4 py-16'>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Popover key={side}>
          <PopoverTrigger render={<Button variant='outline' />}>Open {side} popover</PopoverTrigger>
          <PopoverContent side={side} align='start' collisionPadding={12} className='max-w-[calc(100vw-24px)]'>
            <PopoverHeader>
              <PopoverTitle>Local dimensions</PopoverTitle>
              <PopoverDescription>Positioned at the {side}; edges can flip to stay visible.</PopoverDescription>
            </PopoverHeader>
            <Label htmlFor={`popover-${side}`}>Width</Label>
            <Input id={`popover-${side}`} type='number' defaultValue={320} />
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
}
