import 'react-medium-image-zoom/dist/styles.css'
import '@/styles/image-zoom.css'

import { BlurImage } from '@repo/ui/components/blur-image'
import { cn } from 'cn'
import Zoom from 'react-medium-image-zoom'

export function MdxImage(props: React.ComponentProps<typeof BlurImage>) {
  const { alt, className, ...rest } = props

  return (
    <figure>
      <Zoom zoomMargin={40}>
        <BlurImage className={cn('rounded-lg border', className)} alt={alt} {...rest} />
      </Zoom>
      <figcaption className='mt-4 text-center'>{alt}</figcaption>
    </figure>
  )
}
