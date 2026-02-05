import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'

import { Button } from '../ui/button'
import { Demo, DemoItem } from '../ui/demo'

function ButtonDemo() {
  return (
    <Demo title='Buttons'>
      <ButtonVariantsAndSizes />
      <ButtonIconRight />
      <ButtonIconLeft />
      <ButtonIconOnly />
    </Demo>
  )
}

function ButtonVariantsAndSizes() {
  return (
    <DemoItem title='Variants & Sizes' orientation='vertical'>
      <div className='flex flex-wrap items-center gap-2'>
        <Button size='xs' variant='default'>
          Default
        </Button>
        <Button size='xs' variant='outline'>
          Outline
        </Button>
        <Button size='xs' variant='secondary'>
          Secondary
        </Button>
        <Button size='xs' variant='ghost'>
          Ghost
        </Button>
        <Button size='xs' variant='destructive'>
          Destructive
        </Button>
        <Button size='xs' variant='link'>
          Link
        </Button>
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        <Button size='sm' variant='default'>
          Default
        </Button>
        <Button size='sm' variant='outline'>
          Outline
        </Button>
        <Button size='sm' variant='secondary'>
          Secondary
        </Button>
        <Button size='sm' variant='ghost'>
          Ghost
        </Button>
        <Button size='sm' variant='destructive'>
          Destructive
        </Button>
        <Button size='sm' variant='link'>
          Link
        </Button>
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        <Button size='default' variant='default'>
          Default
        </Button>
        <Button size='default' variant='outline'>
          Outline
        </Button>
        <Button size='default' variant='secondary'>
          Secondary
        </Button>
        <Button size='default' variant='ghost'>
          Ghost
        </Button>
        <Button size='default' variant='destructive'>
          Destructive
        </Button>
        <Button size='default' variant='link'>
          Link
        </Button>
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        <Button size='lg' variant='default'>
          Default
        </Button>
        <Button size='lg' variant='outline'>
          Outline
        </Button>
        <Button size='lg' variant='secondary'>
          Secondary
        </Button>
        <Button size='lg' variant='ghost'>
          Ghost
        </Button>
        <Button size='lg' variant='destructive'>
          Destructive
        </Button>
        <Button size='lg' variant='link'>
          Link
        </Button>
      </div>
    </DemoItem>
  )
}

function ButtonIconRight() {
  return (
    <DemoItem title='Icon Right' orientation='vertical'>
      <div className='flex flex-wrap items-center gap-2'>
        <Button size='xs' variant='default'>
          Default
          <ArrowRightIcon data-icon='inline-end' />
        </Button>
        <Button size='xs' variant='outline'>
          Outline
          <ArrowRightIcon data-icon='inline-end' />
        </Button>
        <Button size='xs' variant='secondary'>
          Secondary
          <ArrowRightIcon data-icon='inline-end' />
        </Button>
        <Button size='xs' variant='ghost'>
          Ghost
          <ArrowRightIcon data-icon='inline-end' />
        </Button>
        <Button size='xs' variant='destructive'>
          Destructive
          <ArrowRightIcon data-icon='inline-end' />
        </Button>
        <Button size='xs' variant='link'>
          Link
          <ArrowRightIcon data-icon='inline-end' />
        </Button>
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        <Button size='sm' variant='default'>
          Default
          <ArrowRightIcon data-icon='inline-end' />
        </Button>
        <Button size='sm' variant='outline'>
          Outline
          <ArrowRightIcon data-icon='inline-end' />
        </Button>
        <Button size='sm' variant='secondary'>
          Secondary
          <ArrowRightIcon data-icon='inline-end' />
        </Button>
        <Button size='sm' variant='ghost'>
          Ghost
          <ArrowRightIcon data-icon='inline-end' />
        </Button>
        <Button size='sm' variant='destructive'>
          Destructive
          <ArrowRightIcon data-icon='inline-end' />
        </Button>
        <Button size='sm' variant='link'>
          Link
          <ArrowRightIcon data-icon='inline-end' />
        </Button>
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        <Button size='default' variant='default'>
          Default
          <ArrowRightIcon data-icon='inline-end' />
        </Button>
        <Button size='default' variant='outline'>
          Outline
          <ArrowRightIcon data-icon='inline-end' />
        </Button>
        <Button size='default' variant='secondary'>
          Secondary
          <ArrowRightIcon data-icon='inline-end' />
        </Button>
        <Button size='default' variant='ghost'>
          Ghost
          <ArrowRightIcon data-icon='inline-end' />
        </Button>
        <Button size='default' variant='destructive'>
          Destructive
          <ArrowRightIcon data-icon='inline-end' />
        </Button>
        <Button size='default' variant='link'>
          Link
          <ArrowRightIcon data-icon='inline-end' />
        </Button>
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        <Button size='lg' variant='default'>
          Default
          <ArrowRightIcon data-icon='inline-end' />
        </Button>
        <Button size='lg' variant='outline'>
          Outline
          <ArrowRightIcon data-icon='inline-end' />
        </Button>
        <Button size='lg' variant='secondary'>
          Secondary
          <ArrowRightIcon data-icon='inline-end' />
        </Button>
        <Button size='lg' variant='ghost'>
          Ghost
          <ArrowRightIcon data-icon='inline-end' />
        </Button>
        <Button size='lg' variant='destructive'>
          Destructive
          <ArrowRightIcon data-icon='inline-end' />
        </Button>
        <Button size='lg' variant='link'>
          Link
          <ArrowRightIcon data-icon='inline-end' />
        </Button>
      </div>
    </DemoItem>
  )
}

function ButtonIconLeft() {
  return (
    <DemoItem title='Icon Left' orientation='vertical'>
      <div className='flex flex-wrap items-center gap-2'>
        <Button size='xs' variant='default'>
          <ArrowLeftIcon data-icon='inline-start' />
          Default
        </Button>
        <Button size='xs' variant='outline'>
          <ArrowLeftIcon data-icon='inline-start' />
          Outline
        </Button>
        <Button size='xs' variant='secondary'>
          <ArrowLeftIcon data-icon='inline-start' />
          Secondary
        </Button>
        <Button size='xs' variant='ghost'>
          <ArrowLeftIcon data-icon='inline-start' />
          Ghost
        </Button>
        <Button size='xs' variant='destructive'>
          <ArrowLeftIcon data-icon='inline-start' />
          Destructive
        </Button>
        <Button size='xs' variant='link'>
          <ArrowLeftIcon data-icon='inline-start' />
          Link
        </Button>
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        <Button size='sm' variant='default'>
          <ArrowLeftIcon data-icon='inline-start' />
          Default
        </Button>
        <Button size='sm' variant='outline'>
          <ArrowLeftIcon data-icon='inline-start' />
          Outline
        </Button>
        <Button size='sm' variant='secondary'>
          <ArrowLeftIcon data-icon='inline-start' />
          Secondary
        </Button>
        <Button size='sm' variant='ghost'>
          <ArrowLeftIcon data-icon='inline-start' />
          Ghost
        </Button>
        <Button size='sm' variant='destructive'>
          <ArrowLeftIcon data-icon='inline-start' />
          Destructive
        </Button>
        <Button size='sm' variant='link'>
          <ArrowLeftIcon data-icon='inline-start' />
          Link
        </Button>
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        <Button size='default' variant='default'>
          <ArrowLeftIcon data-icon='inline-start' />
          Default
        </Button>
        <Button size='default' variant='outline'>
          <ArrowLeftIcon data-icon='inline-start' />
          Outline
        </Button>
        <Button size='default' variant='secondary'>
          <ArrowLeftIcon data-icon='inline-start' />
          Secondary
        </Button>
        <Button size='default' variant='ghost'>
          <ArrowLeftIcon data-icon='inline-start' />
          Ghost
        </Button>
        <Button size='default' variant='destructive'>
          <ArrowLeftIcon data-icon='inline-start' />
          Destructive
        </Button>
        <Button size='default' variant='link'>
          <ArrowLeftIcon data-icon='inline-start' />
          Link
        </Button>
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        <Button size='lg' variant='default'>
          <ArrowLeftIcon data-icon='inline-start' />
          Default
        </Button>
        <Button size='lg' variant='outline'>
          <ArrowLeftIcon data-icon='inline-start' />
          Outline
        </Button>
        <Button size='lg' variant='secondary'>
          <ArrowLeftIcon data-icon='inline-start' />
          Secondary
        </Button>
        <Button size='lg' variant='ghost'>
          <ArrowLeftIcon data-icon='inline-start' />
          Ghost
        </Button>
        <Button size='lg' variant='destructive'>
          <ArrowLeftIcon data-icon='inline-start' />
          Destructive
        </Button>
        <Button size='lg' variant='link'>
          <ArrowLeftIcon data-icon='inline-start' />
          Link
        </Button>
      </div>
    </DemoItem>
  )
}

function ButtonIconOnly() {
  return (
    <DemoItem title='Icon Only' orientation='vertical'>
      <div className='flex flex-wrap items-center gap-2'>
        <Button size='icon-xs' variant='default'>
          <ArrowRightIcon />
        </Button>
        <Button size='icon-xs' variant='outline'>
          <ArrowRightIcon />
        </Button>
        <Button size='icon-xs' variant='secondary'>
          <ArrowRightIcon />
        </Button>
        <Button size='icon-xs' variant='ghost'>
          <ArrowRightIcon />
        </Button>
        <Button size='icon-xs' variant='destructive'>
          <ArrowRightIcon />
        </Button>
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        <Button size='icon-sm' variant='default'>
          <ArrowRightIcon />
        </Button>
        <Button size='icon-sm' variant='outline'>
          <ArrowRightIcon />
        </Button>
        <Button size='icon-sm' variant='secondary'>
          <ArrowRightIcon />
        </Button>
        <Button size='icon-sm' variant='ghost'>
          <ArrowRightIcon />
        </Button>
        <Button size='icon-sm' variant='destructive'>
          <ArrowRightIcon />
        </Button>
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        <Button size='icon' variant='default'>
          <ArrowRightIcon />
        </Button>
        <Button size='icon' variant='outline'>
          <ArrowRightIcon />
        </Button>
        <Button size='icon' variant='secondary'>
          <ArrowRightIcon />
        </Button>
        <Button size='icon' variant='ghost'>
          <ArrowRightIcon />
        </Button>
        <Button size='icon' variant='destructive'>
          <ArrowRightIcon />
        </Button>
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        <Button size='icon-lg' variant='default'>
          <ArrowRightIcon />
        </Button>
        <Button size='icon-lg' variant='outline'>
          <ArrowRightIcon />
        </Button>
        <Button size='icon-lg' variant='secondary'>
          <ArrowRightIcon />
        </Button>
        <Button size='icon-lg' variant='ghost'>
          <ArrowRightIcon />
        </Button>
        <Button size='icon-lg' variant='destructive'>
          <ArrowRightIcon />
        </Button>
      </div>
    </DemoItem>
  )
}

export default ButtonDemo
