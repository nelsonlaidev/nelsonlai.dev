import { CatchBoundary } from '@tanstack/react-router'
import { createContext, lazy, Suspense, use, useCallback, useMemo, useRef, useState, useTransition } from 'react'
import { createPortal } from 'react-dom'

import { m } from '@/paraglide/messages'

const MdxLightbox = lazy(async () => import('./mdx-lightbox'))

export type GalleryImage = {
  src: string
  alt?: string
  width?: number
  height?: number
}

type GalleryContextProps = {
  register: (trigger: HTMLButtonElement, image: GalleryImage) => () => void
  open: (trigger: HTMLButtonElement, caption: HTMLElement) => void
  loading: boolean
}

const GalleryContext = createContext<GalleryContextProps | null>(null)
GalleryContext.displayName = 'MdxGallery'

export function useMdxGallery() {
  const gallery = use(GalleryContext)

  if (!gallery) {
    throw new Error('useMdxGallery must be used within <MdxGallery />')
  }

  return gallery
}

type GallerySelection = {
  images: GalleryImage[]
  index: number
  trigger: HTMLButtonElement
  caption: HTMLElement
}

type MdxGalleryProps = {
  children: React.ReactNode
}

export function MdxGallery(props: MdxGalleryProps) {
  const { children } = props

  const [selection, setSelection] = useState<GallerySelection | null>(null)
  const [loading, startTransition] = useTransition()
  const imagesRef = useRef(new Map<HTMLButtonElement, GalleryImage>())

  const register = useCallback((trigger: HTMLButtonElement, image: GalleryImage) => {
    imagesRef.current.set(trigger, image)

    return () => {
      imagesRef.current.delete(trigger)
    }
  }, [])

  const open = useCallback(
    (trigger: HTMLButtonElement, caption: HTMLElement) => {
      const image = imagesRef.current.get(trigger)
      if (!image) return

      const images = [...imagesRef.current.values()]

      startTransition(() => {
        setSelection({ images, index: images.indexOf(image), trigger, caption })
      })
    },
    [startTransition],
  )

  const context = useMemo(() => ({ register, open, loading }), [register, open, loading])

  function close() {
    setSelection(null)
    selection?.trigger.focus({ preventScroll: true })
  }

  return (
    <GalleryContext value={context}>
      {children}
      {loading && <output className='sr-only'>{m.common_loading()}</output>}
      <Suspense fallback={null}>
        {selection && (
          <CatchBoundary
            getResetKey={() => selection.trigger}
            errorComponent={() =>
              createPortal(
                <span role='alert' className='mt-2 block text-sm text-foreground'>
                  {m.blog_image_viewer_error()}{' '}
                  <a
                    className='text-link underline'
                    href={selection.images[selection.index]?.src}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {m.blog_image_viewer_original()}
                  </a>
                </span>,
                selection.caption,
              )
            }
          >
            <MdxLightbox images={selection.images} index={selection.index} close={close} />
          </CatchBoundary>
        )}
      </Suspense>
    </GalleryContext>
  )
}
