import 'react-medium-image-zoom/dist/styles.css'
import '@/styles/viewer.css'

import { BlurImage } from '@repo/ui/components/blur-image'
import { cn } from 'cn'
import { useEffect } from 'react'
import Zoom from 'react-medium-image-zoom'

import { useArticleGallery } from '@/features/posts/article-gallery'
import { m } from '@/paraglide/messages'

export function MdxImage(props: React.ComponentProps<typeof BlurImage>) {
  const { alt, className, src, ...rest } = props

  const gallery = useArticleGallery()
  const register = gallery?.register
  const { width, height } = rest
  useEffect(() => {
    if (typeof src !== 'string' || !register) return
    return register({
      src,
      alt,
      width: width === undefined ? undefined : Number(width),
      height: height === undefined ? undefined : Number(height),
    })
  }, [register, src, alt, width, height])
  const image = <BlurImage className={cn('rounded-lg border', className)} src={src} alt={alt} {...rest} />

  return (
    <figure>
      {gallery && typeof src === 'string' ? (
        <button
          type='button'
          aria-label={m.ocean_viewer_enlarge({ alt })}
          aria-haspopup='dialog'
          aria-busy={gallery.loading || undefined}
          onClick={(event) => {
            gallery.open(src, event.currentTarget)
          }}
          className='relative block w-full cursor-zoom-in border-0 bg-transparent p-0 text-inherit focus-visible:outline-2 focus-visible:outline-offset-5 focus-visible:outline-[#c1e5cf]'
        >
          {image}
        </button>
      ) : (
        <Zoom zoomMargin={40} zoomImg={{ src, alt }}>
          {image}
        </Zoom>
      )}
      <figcaption className='mt-4 text-center'>{alt}</figcaption>
    </figure>
  )
}
