import { ImageOffIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

export function ProductImage(props: React.ComponentProps<'img'>) {
  const { src, srcSet } = props

  return <ProductImageContent key={JSON.stringify([src, srcSet])} {...props} />
}

function ProductImageContent(props: React.ComponentProps<'img'>) {
  const { ref, onError, alt = '', ...imageProps } = props
  const [failed, setFailed] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const setImageRef = useCallback(
    (image: HTMLImageElement | null) => {
      imageRef.current = image
      const cleanup = typeof ref === 'function' ? ref(image) : undefined
      if (ref && typeof ref !== 'function') ref.current = image

      return () => {
        imageRef.current = null
        if (typeof cleanup === 'function') cleanup()
        else if (typeof ref === 'function') ref(null)
        else if (ref) ref.current = null
      }
    },
    [ref],
  )

  useEffect(() => {
    // An SSR image can fail before React attaches its error listener.
    if (imageRef.current?.complete && imageRef.current.naturalWidth === 0) setFailed(true)
  }, [])

  return failed ? (
    <span
      className={imageProps.className ?? 'block aspect-video w-full'}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      <ImageOffIcon className='size-full p-2 opacity-50' />
    </span>
  ) : (
    <img
      {...imageProps}
      ref={setImageRef}
      alt={alt}
      onError={(event) => {
        setFailed(true)
        onError?.(event)
      }}
    />
  )
}
