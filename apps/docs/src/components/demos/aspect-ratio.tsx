import { AspectRatio } from '@repo/ui/components/aspect-ratio'
import Image from 'next/image'

const AspectRatioDemo = () => {
  return (
    <AspectRatio ratio={16 / 9} className='rounded-lg bg-muted'>
      <Image
        src='https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80'
        alt='A white wall by Drew Beamer'
        fill
        className='size-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale'
      />
    </AspectRatio>
  )
}

export default AspectRatioDemo
