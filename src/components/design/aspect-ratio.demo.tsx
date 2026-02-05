'use client'

import Image from 'next/image'

import { AspectRatio } from '../ui/aspect-ratio'
import { Demo, DemoItem } from '../ui/demo'

function AspectRatioDemo() {
  return (
    <Demo title='Aspect Ratio' className='md:grid-cols-1'>
      <AspectRatioRatios />
    </Demo>
  )
}

function AspectRatioRatios() {
  const imageUrl =
    'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?q=80&w=2803&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  const imageAlt = 'White concrete wall by Oleg Laptev on Unsplash'

  return (
    <DemoItem title='Ratios' className='grid md:grid-cols-2 data-horizontal:gap-4'>
      <AspectRatio ratio={16 / 9} className='rounded-lg bg-muted'>
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className='size-full rounded-lg object-cover grayscale dark:brightness-20'
        />
      </AspectRatio>
      <AspectRatio ratio={21 / 9} className='rounded-lg bg-muted'>
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className='size-full rounded-lg object-cover grayscale dark:brightness-20'
        />
      </AspectRatio>
      <AspectRatio ratio={1} className='rounded-lg bg-muted'>
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className='size-full rounded-lg object-cover grayscale dark:brightness-20'
        />
      </AspectRatio>
      <AspectRatio ratio={9 / 16} className='rounded-lg bg-muted'>
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className='size-full rounded-lg object-cover grayscale dark:brightness-20'
        />
      </AspectRatio>
    </DemoItem>
  )
}

export default AspectRatioDemo
