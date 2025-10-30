import { ScrollArea } from '@repo/ui/components/scroll-area'
import { Separator } from '@repo/ui/components/separator'
import { Fragment } from 'react'

const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`)

const ScrollAreaDemo = () => {
  return (
    <ScrollArea className='h-72 w-48 rounded-md border'>
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
  )
}

export default ScrollAreaDemo
