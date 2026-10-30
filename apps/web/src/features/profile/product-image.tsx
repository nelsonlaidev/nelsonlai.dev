import { ImageOffIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function ProductImage(props: React.ComponentProps<'img'>) {
  const [failed, setFailed] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  useEffect(() => {
    // An SSR image can fail before React attaches its error listener.
    if (imageRef.current?.complete && imageRef.current.naturalWidth === 0) setFailed(true)
  }, [props.src])
  return failed ? (
    <span
      className={props.className ?? 'block aspect-video w-full'}
      role={props.alt ? 'img' : undefined}
      aria-label={props.alt ?? undefined}
      aria-hidden={props.alt ? undefined : true}
    >
      <ImageOffIcon className='size-full p-2 opacity-50' />
    </span>
  ) : (
    <img
      {...props}
      ref={imageRef}
      alt={props.alt ?? ''}
      onError={() => {
        setFailed(true)
      }}
    />
  )
}
