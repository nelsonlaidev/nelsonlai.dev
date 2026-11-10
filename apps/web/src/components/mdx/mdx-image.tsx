import { BlurImage } from '@repo/ui/components/blur-image'
import { cn } from 'cn'
import { useEffect, useRef } from 'react'

import { m } from '@/paraglide/messages'

import { useMdxGallery } from './mdx-gallery'

export function MdxImage(props: React.ComponentProps<typeof BlurImage>) {
  const { alt, className, src, width, height, ...rest } = props

  const { register, open, loading } = useMdxGallery()
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!triggerRef.current) return

    return register(triggerRef.current, {
      src,
      alt,
      width: width === undefined ? undefined : Number(width),
      height: height === undefined ? undefined : Number(height),
    })
  }, [register, src, alt, width, height])

  return (
    <figure>
      <button
        ref={triggerRef}
        type='button'
        aria-label={m.blog_image_viewer_enlarge({ alt })}
        aria-haspopup='dialog'
        aria-busy={loading || undefined}
        onClick={(event) => {
          open(event.currentTarget)
        }}
        className='relative mb-4 block w-full cursor-zoom-in rounded-lg focus-visible:outline-2 focus-visible:outline-offset-5 focus-visible:outline-ring'
      >
        <BlurImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn('rounded-lg border', className)}
          {...rest}
        />
      </button>
      <figcaption className='text-center'>{alt}</figcaption>
    </figure>
  )
}
