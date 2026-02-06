import { Button } from '../ui/button'
import { Demo, DemoItem } from '../ui/demo'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer'

function DrawerDemo() {
  return (
    <Demo title='Drawer'>
      <DrawerWithSides />
    </Demo>
  )
}

const DRAWER_SIDES = ['top', 'right', 'bottom', 'left'] as const

function DrawerWithSides() {
  return (
    <DemoItem>
      {DRAWER_SIDES.map((side) => (
        <Drawer key={side} direction={side === 'bottom' ? undefined : side}>
          <DrawerTrigger asChild>
            <Button variant='outline' className='capitalize'>
              {side}
            </Button>
          </DrawerTrigger>
          <DrawerContent className='data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]'>
            <DrawerHeader>
              <DrawerTitle>Move Goal</DrawerTitle>
              <DrawerDescription>Set your daily activity goal.</DrawerDescription>
            </DrawerHeader>
            <div className='no-scrollbar overflow-y-auto px-4'>
              {Array.from({ length: 10 }).map((_, index) => (
                <p key={index} className='mb-4 leading-normal'>
                  But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born
                  and I will give you a complete account of the system, and expound the actual teachings of the great
                  explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids
                  pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure
                  rationally encounter consequences that are extremely painful.
                </p>
              ))}
            </div>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose asChild>
                <Button variant='outline'>Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </DemoItem>
  )
}

export default DrawerDemo
