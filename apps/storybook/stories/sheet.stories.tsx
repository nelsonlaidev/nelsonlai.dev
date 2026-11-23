import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@repo/ui/components/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@repo/ui/components/sheet'

const meta = {
  title: 'Components/Sheet',
} satisfies Meta

export default meta

type Story = StoryObj

type SheetExampleProps = {
  side?: 'top' | 'right' | 'bottom' | 'left'
  closeIcon?: boolean
}

function SheetExample(props: SheetExampleProps) {
  const { side = 'right', closeIcon = true } = props

  return (
    <Sheet>
      <SheetTrigger render={<Button variant='outline' />}>Open {side} sheet</SheetTrigger>
      <SheetContent side={side} showCloseButton={closeIcon}>
        <SheetHeader>
          <SheetTitle>Local settings</SheetTitle>
          <SheetDescription>
            A longer explanation demonstrates text wrapping without connecting to account settings.
          </SheetDescription>
        </SheetHeader>
        <div className='overflow-y-auto px-4 py-6'>Sheet content stays within the selected viewport edge.</div>
        <SheetFooter>
          <SheetClose render={<Button />}>Close sheet</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export const Sides: Story = {
  render: () => (
    <div className='flex flex-wrap gap-3'>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <SheetExample key={side} side={side} />
      ))}
    </div>
  ),
}

export const WithoutCloseIcon: Story = {
  render: () => <SheetExample closeIcon={false} />,
}
