'use client'

import { PlusIcon } from 'lucide-react'
import Image from 'next/image'

import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Demo, DemoItem } from '../ui/demo'

function CardDemo() {
  return (
    <Demo title='Card'>
      <CardSizes />
      <CardWithBorder />
      <CardWithImage />
    </Demo>
  )
}

function CardSizes() {
  return (
    <DemoItem title='Sizes' orientation='vertical'>
      <Card size='default' className='mx-auto w-full max-w-sm'>
        <CardHeader>
          <CardTitle>Default Card</CardTitle>
          <CardDescription>This card uses the default size variant.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            The card component supports a size prop that defaults to &quot;default&quot; for standard spacing and
            sizing.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant='outline' className='w-full'>
            Action
          </Button>
        </CardFooter>
      </Card>
      <Card size='sm' className='mx-auto w-full max-w-sm'>
        <CardHeader>
          <CardTitle>Small Card</CardTitle>
          <CardDescription>This card uses the small size variant.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            The card component supports a size prop that can be set to &quot;sm&quot; for a more compact appearance.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant='outline' size='sm' className='w-full'>
            Action
          </Button>
        </CardFooter>
      </Card>
    </DemoItem>
  )
}

function CardWithBorder() {
  return (
    <DemoItem title='With Border' orientation='vertical'>
      <Card className='mx-auto w-full max-w-sm'>
        <CardHeader className='border-b'>
          <CardTitle>Header with Border</CardTitle>
          <CardDescription>This is a card with a header that has a bottom border.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            The header has a border-b class applied, creating a visual separation between the header and content
            sections.
          </p>
        </CardContent>
      </Card>
      <Card className='mx-auto w-full max-w-sm'>
        <CardContent>
          <p>
            The footer has a border-t class applied, creating a visual separation between the content and footer
            sections.
          </p>
        </CardContent>
        <CardFooter className='border-t'>
          <Button variant='outline' className='w-full'>
            Footer with Border
          </Button>
        </CardFooter>
      </Card>
      <Card size='sm' className='mx-auto w-full max-w-sm'>
        <CardHeader className='border-b'>
          <CardTitle>Header with Border</CardTitle>
          <CardDescription>This is a small card with a header that has a bottom border.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            The header has a border-b class applied, creating a visual separation between the header and content
            sections.
          </p>
        </CardContent>
      </Card>
      <Card size='sm' className='mx-auto w-full max-w-sm'>
        <CardContent>
          <p>
            The footer has a border-t class applied, creating a visual separation between the content and footer
            sections.
          </p>
        </CardContent>
        <CardFooter className='border-t'>
          <Button variant='outline' size='sm' className='w-full'>
            Footer with Border
          </Button>
        </CardFooter>
      </Card>
    </DemoItem>
  )
}

function CardWithImage() {
  return (
    <DemoItem title='With Image' orientation='vertical'>
      <Card size='default' className='relative mx-auto w-full max-w-sm pt-0'>
        <div className='absolute inset-0 z-30 aspect-video bg-primary opacity-50 mix-blend-color' />
        <Image
          src='https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          alt='Pink and yellow abstract painting on Unsplash'
          className='relative z-20 aspect-video w-full object-cover brightness-60 grayscale'
          width={1887}
          height={2830}
        />
        <CardHeader>
          <CardTitle>Beautiful Landscape</CardTitle>
          <CardDescription>A stunning view that captures the essence of natural beauty.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className='w-full'>
            <PlusIcon data-icon='inline-start' />
            Button
          </Button>
        </CardFooter>
      </Card>
      <Card size='sm' className='relative mx-auto w-full max-w-sm data-[size=sm]:pt-0'>
        <div className='absolute inset-0 z-30 aspect-video bg-primary opacity-50 mix-blend-color' />
        <Image
          src='https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          alt='Pink and yellow abstract painting on Unsplash'
          className='relative z-20 aspect-video w-full object-cover brightness-60 grayscale'
          width={1887}
          height={2830}
        />
        <CardHeader>
          <CardTitle>Beautiful Landscape</CardTitle>
          <CardDescription>A stunning view that captures the essence of natural beauty.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button size='sm' className='w-full'>
            <PlusIcon data-icon='inline-start' />
            Button
          </Button>
        </CardFooter>
      </Card>
    </DemoItem>
  )
}

export default CardDemo
