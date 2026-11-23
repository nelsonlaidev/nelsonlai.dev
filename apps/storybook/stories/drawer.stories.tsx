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

import preview from '../.storybook/preview'

const meta = preview.meta({
  title: 'Components/Drawer',
  component: Drawer,
})

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

export const Directions = meta.story({
  render: () => (
    <div className='flex flex-wrap gap-3'>
      {(['down', 'up', 'left', 'right'] as const).map((direction) => (
        <DrawerExample key={direction} direction={direction} />
      ))}
    </div>
  ),
})

export const SnapPoints = meta.story({
  render: () => <DrawerExample snap />,
})

export const Nested = meta.story({
  render: () => <DrawerExample nested />,
})

export const NonModal = meta.story({
  render: () => <DrawerExample modal={false} />,
})
