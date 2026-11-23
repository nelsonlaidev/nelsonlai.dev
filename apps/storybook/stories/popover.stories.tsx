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

import preview from '../.storybook/preview'

const meta = preview.meta({
  title: 'Components/Popover',
})

export const Positioned = meta.story({
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
})
