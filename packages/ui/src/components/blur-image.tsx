import { cn } from 'cn'
import { useEffect, useRef, useState } from 'react'

type ImageProps = Omit<React.ComponentProps<'img'>, 'src' | 'alt'> & {
  src: string
  alt: string
  imageClassName?: string
  lazy?: boolean
}

export function BlurImage(props: ImageProps) {
  const { src, alt, imageClassName, lazy = true, className, onLoad, onError, ...rest } = props

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
        loading={lazy ? 'lazy' : 'eager'}
        fetchPriority={lazy ? 'auto' : 'high'}
        decoding='async'
        className={cn(
          'transition-[filter,transform] duration-[700ms,150ms] ease-[ease] group-data-[loading=true]:blur-xl group-data-[loading=true]:grayscale motion-safe:group-data-[loading=true]:scale-[1.02] motion-reduce:transition-none',
          imageClassName,
        )}
        onLoad={(event) => {
          setIsLoading(false)
          onLoad?.(event)
        }}
        onError={(event) => {
          setIsLoading(false)
          onError?.(event)
        }}
        {...rest}
      />
    </div>
  )
}
