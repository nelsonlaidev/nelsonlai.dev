import { Demo, DemoItem } from '../ui/demo'
import { Separator } from '../ui/separator'

function SeparatorDemo() {
  return (
    <Demo title='Separator'>
      <SeparatorHorizontal />
      <SeparatorVertical />
      <SeparatorVerticalMenu />
      <SeparatorInList />
    </Demo>
  )
}

function SeparatorHorizontal() {
  return (
    <DemoItem title='Horizontal'>
      <div className='flex flex-col gap-4 text-sm'>
        <div className='flex flex-col gap-1'>
          <div className='leading-none font-medium'>shadcn/ui</div>
          <div className='text-muted-foreground'>The Foundation for your Design System</div>
        </div>
        <Separator />
        <div>A set of beautifully designed components that you can customize, extend, and build on.</div>
      </div>
    </DemoItem>
  )
}

function SeparatorVertical() {
  return (
    <DemoItem title='Vertical'>
      <div className='flex h-5 items-center gap-4 text-sm'>
        <div>Blog</div>
        <Separator orientation='vertical' />
        <div>Docs</div>
        <Separator orientation='vertical' />
        <div>Source</div>
      </div>
    </DemoItem>
  )
}

function SeparatorVerticalMenu() {
  return (
    <DemoItem title='Vertical Menu'>
      <div className='flex items-center gap-2 text-sm md:gap-4'>
        <div className='flex flex-col gap-1'>
          <span className='font-medium'>Settings</span>
          <span className='text-xs text-muted-foreground'>Manage preferences</span>
        </div>
        <Separator orientation='vertical' />
        <div className='flex flex-col gap-1'>
          <span className='font-medium'>Account</span>
          <span className='text-xs text-muted-foreground'>Profile & security</span>
        </div>
        <Separator orientation='vertical' />
        <div className='flex flex-col gap-1'>
          <span className='font-medium'>Help</span>
          <span className='text-xs text-muted-foreground'>Support & docs</span>
        </div>
      </div>
    </DemoItem>
  )
}

function SeparatorInList() {
  return (
    <DemoItem title='In List' className='text-sm'>
      <dl className='flex w-full items-center justify-between'>
        <dt>Item 1</dt>
        <dd className='text-muted-foreground'>Value 1</dd>
      </dl>
      <Separator />
      <dl className='flex w-full items-center justify-between'>
        <dt>Item 2</dt>
        <dd className='text-muted-foreground'>Value 2</dd>
      </dl>
      <Separator />
      <dl className='flex w-full items-center justify-between'>
        <dt>Item 3</dt>
        <dd className='text-muted-foreground'>Value 3</dd>
      </dl>
    </DemoItem>
  )
}

export default SeparatorDemo
