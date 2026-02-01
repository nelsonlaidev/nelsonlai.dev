import { Button } from '../ui/button'
import { Demo, DemoItem } from '../ui/demo'
import { Field, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '../ui/sheet'

function SheetDemo() {
  return (
    <Demo title='Sheet'>
      <SheetWithForm />
      <SheetNoCloseButton />
      <SheetWithSides />
    </Demo>
  )
}

function SheetWithForm() {
  return (
    <DemoItem title='With Form'>
      <Sheet>
        <SheetTrigger render={<Button variant='outline'>Open</Button>} />
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>Make changes to your profile here. Click save when you&apos;re done.</SheetDescription>
          </SheetHeader>
          <div className='px-6'>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='sheet-demo-name'>Name</FieldLabel>
                <Input id='sheet-demo-name' defaultValue='Pedro Duarte' />
              </Field>
              <Field>
                <FieldLabel htmlFor='sheet-demo-username'>Username</FieldLabel>
                <Input id='sheet-demo-username' defaultValue='@peduarte' />
              </Field>
            </FieldGroup>
          </div>
          <SheetFooter>
            <Button type='submit'>Save changes</Button>
            <SheetClose render={<Button variant='outline'>Close</Button>} />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </DemoItem>
  )
}

function SheetNoCloseButton() {
  return (
    <DemoItem title='No Close Button'>
      <Sheet>
        <SheetTrigger render={<Button variant='outline'>No Close Button</Button>} />
        <SheetContent showCloseButton={false}>
          <SheetHeader>
            <SheetTitle>No Close Button</SheetTitle>
            <SheetDescription>
              This sheet doesn&apos;t have a close button in the top-right corner. You can only close it using the
              button below.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </DemoItem>
  )
}

const SHEET_SIDES = ['top', 'right', 'bottom', 'left'] as const

function SheetWithSides() {
  return (
    <DemoItem title='Sides'>
      {SHEET_SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger
            render={
              <Button variant='outline' className='capitalize'>
                {side}
              </Button>
            }
          />
          <SheetContent side={side} className='data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]'>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>Make changes to your profile here. Click save when you&apos;re done.</SheetDescription>
            </SheetHeader>
            <div className='no-scrollbar overflow-y-auto px-6'>
              {Array.from({ length: 10 }).map((_, index) => (
                <p key={index} className='mb-4 leading-normal'>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                  officia deserunt mollit anim id est laborum.
                </p>
              ))}
            </div>
            <SheetFooter>
              <Button type='submit'>Save changes</Button>
              <SheetClose render={<Button variant='outline'>Cancel</Button>} />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </DemoItem>
  )
}

export default SheetDemo
