import { IMAGE_WIDTHS } from '@repo/utils'
import { cn } from 'cn'
import { useEffect, useRef, useState } from 'react'

type ImageProps = React.ComponentProps<'img'> & {
  src: string
  alt: string
  imageClassName?: string
  lazy?: boolean
  unoptimized?: boolean
}

export function BlurImage(props: ImageProps) {
  const {
    src,
    alt,
    width,
    height,
    imageClassName,
    lazy = true,
    unoptimized = false,
    srcSet,
    sizes,
    className,
    style,
    onLoad,
    onError,
    ...rest
  } = props

  const imageWidth = Number(width)
  const optimize = !unoptimized && !srcSet && src.startsWith('/images/') && /\.(?:png|jpe?g|webp)$/i.test(src)
  const candidates = IMAGE_WIDTHS.filter((size) => !imageWidth || size <= imageWidth * 2)
  const responsiveSrcSet = optimize
    ? candidates.map((size) => `/api/image?src=${encodeURIComponent(src)}&w=${size} ${size}w`).join(', ')
    : srcSet
  const responsiveSizes =
    sizes ??
    (imageWidth && imageWidth <= 128
      ? `${imageWidth}px`
      : `(max-width: ${imageWidth || 1920}px) 100vw, ${imageWidth || 1920}px`)
  const [isLoading, setIsLoading] = useState(true)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setIsLoading(!imgRef.current?.complete)
  }, [src])

  return (
    <div
      data-loading={isLoading}
      className={cn('group overflow-hidden motion-safe:data-[loading=true]:animate-pulse', className)}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        srcSet={responsiveSrcSet}
        sizes={responsiveSrcSet ? responsiveSizes : sizes}
        width={width}
        height={height}
        loading={lazy ? 'lazy' : 'eager'}
        fetchPriority={lazy ? 'auto' : 'high'}
        decoding='async'
        className={cn(
          'transition-[filter,transform] duration-[700ms,150ms] ease-[ease] group-data-[loading=true]:blur-xl group-data-[loading=true]:grayscale motion-safe:group-data-[loading=true]:scale-[1.02] motion-reduce:transition-none',
          imageClassName,
        )}
        style={{ aspectRatio: width && height ? `${width} / ${height}` : undefined, ...style }}
        onLoad={(event) => {
          setIsLoading(false)
          onLoad?.(event)
        }}
        onError={(event) => {
          setIsLoading(false)
          if (optimize && event.currentTarget.hasAttribute('srcset')) {
            event.currentTarget.removeAttribute('srcset')
            event.currentTarget.src = src
          }
          onError?.(event)
        }}
        {...rest}
      />
    </div>
  )
}
