import Image from 'next/image'
import { Fragment } from 'react'

import { Demo, DemoItem } from '../ui/demo'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import { Separator } from '../ui/separator'

function ScrollAreaDemo() {
  return (
    <Demo title='Scroll Area'>
      <ScrollAreaVertical />
      <ScrollAreaHorizontal />
    </Demo>
  )
}

const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`)

const works = [
  {
    artist: 'Ornella Binni',
    description: 'Grayscale photo of bike on wall',
    art: 'https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80',
  },
  {
    artist: 'Tom Byrom',
    description: 'Grayscale photography of concrete stairs',
    art: 'https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80',
  },
  {
    artist: 'Alex Padurariu',
    description: 'Grayscale photo of concrete structure',
    art: 'https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80',
  },
] as const

function ScrollAreaVertical() {
  return (
    <DemoItem title='Vertical'>
      <ScrollArea className='mx-auto h-72 w-48 rounded-md border'>
        <div className='p-4'>
          <h4 className='mb-4 text-sm leading-none font-medium'>Tags</h4>
          {tags.map((tag) => (
            <Fragment key={tag}>
              <div className='text-sm'>{tag}</div>
              <Separator className='my-2' />
            </Fragment>
          ))}
        </div>
      </ScrollArea>
    </DemoItem>
  )
}

function ScrollAreaHorizontal() {
  return (
    <DemoItem title='Horizontal'>
      <ScrollArea className='mx-auto w-full max-w-96 rounded-md border p-4'>
        <div className='flex gap-4'>
          {works.map((artwork) => (
            <figure key={artwork.artist} className='shrink-0'>
              <div className='overflow-hidden rounded-md'>
                <Image
                  src={artwork.art}
                  alt={`${artwork.description} by ${artwork.artist}`}
                  className='aspect-3/4 size-fit object-cover'
                  width={300}
                  height={400}
                />
              </div>
              <figcaption className='pt-2 text-xs text-muted-foreground'>
                Photo by <span className='font-semibold text-foreground'>{artwork.artist}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </DemoItem>
  )
}

export default ScrollAreaDemo
