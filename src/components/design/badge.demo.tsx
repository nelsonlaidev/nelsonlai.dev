'use client'

import { ArrowRightIcon, ArrowUpRightIcon, BadgeCheckIcon } from 'lucide-react'

import { Badge } from '../ui/badge'
import { Demo, DemoItem } from '../ui/demo'
import { Link } from '../ui/link'
import { Spinner } from '../ui/spinner'

function BadgeDemo() {
  return (
    <Demo title='Badge'>
      <BadgeVariants />
      <BadgeWithIcons />
      <BadgeAsLink />
      <BadgeCustomColors />
    </Demo>
  )
}

function BadgeVariants() {
  return (
    <DemoItem title='Variants'>
      <Badge>Default</Badge>
      <Badge variant='secondary'>Secondary</Badge>
      <Badge variant='destructive'>Destructive</Badge>
      <Badge variant='outline'>Outline</Badge>
      <Badge variant='ghost'>Ghost</Badge>
      <Badge variant='link'>Link</Badge>
    </DemoItem>
  )
}

function BadgeWithIcons() {
  return (
    <DemoItem title='With Icons' orientation='vertical'>
      <div className='flex flex-wrap gap-2'>
        <Badge>
          <BadgeCheckIcon data-icon='inline-start' />
          Default
        </Badge>
        <Badge variant='secondary'>
          <BadgeCheckIcon data-icon='inline-start' />
          Secondary
        </Badge>
        <Badge variant='destructive'>
          <BadgeCheckIcon data-icon='inline-start' />
          Destructive
        </Badge>
        <Badge variant='outline'>
          <BadgeCheckIcon data-icon='inline-start' />
          Outline
        </Badge>
        <Badge variant='ghost'>
          <BadgeCheckIcon data-icon='inline-start' />
          Ghost
        </Badge>
        <Badge variant='link'>
          <BadgeCheckIcon data-icon='inline-start' />
          Link
        </Badge>
      </div>
      <div className='flex flex-wrap gap-2'>
        <Badge>
          Default
          <ArrowRightIcon data-icon='inline-end' />
        </Badge>
        <Badge variant='secondary'>
          Secondary
          <ArrowRightIcon data-icon='inline-end' />
        </Badge>
        <Badge variant='destructive'>
          Destructive
          <ArrowRightIcon data-icon='inline-end' />
        </Badge>
        <Badge variant='outline'>
          Outline
          <ArrowRightIcon data-icon='inline-end' />
        </Badge>
        <Badge variant='ghost'>
          Ghost
          <ArrowRightIcon data-icon='inline-end' />
        </Badge>
        <Badge variant='link'>
          Link
          <ArrowRightIcon data-icon='inline-end' />
        </Badge>
      </div>
      <div className='flex flex-wrap gap-2'>
        <Badge>
          <Spinner data-icon='inline-start' />
          Default
        </Badge>
        <Badge variant='secondary'>
          <Spinner data-icon='inline-start' />
          Secondary
        </Badge>
        <Badge variant='destructive'>
          <Spinner data-icon='inline-start' />
          Destructive
        </Badge>
        <Badge variant='outline'>
          <Spinner data-icon='inline-start' />
          Outline
        </Badge>
        <Badge variant='ghost'>
          <Spinner data-icon='inline-start' />
          Ghost
        </Badge>
        <Badge variant='link'>
          <Spinner data-icon='inline-start' />
          Link
        </Badge>
      </div>
    </DemoItem>
  )
}

function BadgeAsLink() {
  return (
    <DemoItem title='As Link'>
      <Badge
        render={
          <Link href='/design#'>
            Link <ArrowUpRightIcon data-icon='inline-end' />
          </Link>
        }
      />
      <Badge
        variant='secondary'
        render={
          <Link href='/design#'>
            Link <ArrowUpRightIcon data-icon='inline-end' />
          </Link>
        }
      />
      <Badge
        variant='destructive'
        render={
          <Link href='/design#'>
            Link <ArrowUpRightIcon data-icon='inline-end' />
          </Link>
        }
      />
      <Badge
        variant='ghost'
        render={
          <Link href='/design#'>
            Link <ArrowUpRightIcon data-icon='inline-end' />
          </Link>
        }
      />
    </DemoItem>
  )
}

function BadgeCustomColors() {
  return (
    <DemoItem title='Custom Colors'>
      <Badge className='bg-blue-600 text-blue-50 dark:bg-blue-600 dark:text-blue-50'>Blue</Badge>
      <Badge className='bg-green-600 text-green-50 dark:bg-green-600 dark:text-green-50'>Green</Badge>
      <Badge className='bg-sky-600 text-sky-50 dark:bg-sky-600 dark:text-sky-50'>Sky</Badge>
      <Badge className='bg-purple-600 text-purple-50 dark:bg-purple-600 dark:text-purple-50'>Purple</Badge>
      <Badge className='bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'>Blue</Badge>
      <Badge className='bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'>Green</Badge>
      <Badge className='bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'>Sky</Badge>
      <Badge className='bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'>Purple</Badge>
      <Badge className='bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'>Red</Badge>
    </DemoItem>
  )
}

export default BadgeDemo
