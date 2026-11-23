import { BlurImage } from '@repo/ui/components/blur-image'
import { Button } from '@repo/ui/components/button'
import { useState } from 'react'

import preview from '../.storybook/preview'

const meta = preview.meta({
  title: 'Components/Blur image',
})

function ImageExample() {
  const [revision, setRevision] = useState(0)

  return (
    <div className='max-w-md space-y-4'>
      <BlurImage
        key={revision}
        src='/reef.svg'
        alt='Illustrated underwater reef'
        width={640}
        height={400}
        imageClassName='w-full'
      />
      <Button
        variant='outline'
        onClick={() => {
          setRevision((value) => value + 1)
        }}
      >
        Remount image
      </Button>
    </div>
  )
}

export const Loaded = meta.story({
  render: () => <ImageExample />,
})

export const Eager = meta.story({
  render: () => (
    <BlurImage
      src='/reef.svg'
      alt='Eager reef illustration'
      width={640}
      height={400}
      lazy={false}
      className='max-w-sm'
      imageClassName='w-full'
    />
  ),
})

export const Failed = meta.story({
  render: () => (
    <BlurImage
      src='/missing-image.png'
      alt='Unavailable reef illustration'
      width={640}
      height={400}
      className='max-w-sm'
      imageClassName='w-full'
    />
  ),
})
