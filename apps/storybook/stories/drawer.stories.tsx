import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@repo/ui/components/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@repo/ui/components/drawer'

const meta = {
  title: 'Overlays and feedback/Drawer',
  component: Drawer,
  parameters: {
    docs: {
      description: {
        component:
          'Import the `Drawer*` parts from `@repo/ui/components/drawer`. DrawerContent includes the portal, modal backdrop, viewport, and optional swipe handle. Try touch dragging, Escape, Tab, and focus return. Snap points are fractions of viewport height.',
      },
    },
  },
} satisfies Meta<typeof Drawer>

export default meta

type Story = StoryObj<typeof meta>

type DrawerExampleProps = {
  direction?: 'down' | 'up' | 'left' | 'right'
  snap?: boolean
  modal?: boolean
  nested?: boolean
}

function DrawerExample(props: DrawerExampleProps) {
  const { direction = 'down', snap = false, modal = true, nested = false } = props

  return (
    <Drawer swipeDirection={direction} showSwipeHandle modal={modal} snapPoints={snap ? [0.4, 0.8, 1] : undefined}>
      <DrawerTrigger render={<Button variant='outline' />}>Open {direction} drawer</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Local drawer example</DrawerTitle>
          <DrawerDescription>No data is saved. Drag the handle or use the close button.</DrawerDescription>
        </DrawerHeader>
        <div className='overflow-y-auto p-4'>
          <p className='mb-4'>
            A longer description stays readable on a narrow screen, while the title and close action remain available.
          </p>
          {nested && <DrawerExample />}
          {snap && <div className='h-96'>Drag between three snap points.</div>}
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button />}>Close drawer</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export const Directions: Story = {
  render: () => (
    <div className='flex flex-wrap gap-3'>
      {(['down', 'up', 'left', 'right'] as const).map((direction) => (
        <DrawerExample key={direction} direction={direction} />
      ))}
    </div>
  ),
}

export const SnapPoints: Story = {
  render: () => <DrawerExample snap />,
}

export const Nested: Story = {
  render: () => <DrawerExample nested />,
}

export const NonModal: Story = {
  render: () => <DrawerExample modal={false} />,
}
