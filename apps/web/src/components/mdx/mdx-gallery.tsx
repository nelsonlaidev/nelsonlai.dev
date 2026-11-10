import type { ComponentType } from 'react'
import type { MdxLightboxProps } from './mdx-lightbox'

import { createContext, use, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { m } from '@/paraglide/messages'

export type GalleryImage = {
  src: string
  alt?: string
  width?: number
  height?: number
}

const GalleryContext = createContext<{
  register: (trigger: HTMLButtonElement, image: GalleryImage) => () => void
  open: (trigger: HTMLButtonElement) => void
  loading: boolean
} | null>(null)
GalleryContext.displayName = 'MdxGallery'

export function useMdxGallery() {
  const gallery = use(GalleryContext)
  if (!gallery) throw new Error('useMdxGallery must be used within <MdxGallery />')
  return gallery
}

type MdxGalleryProps = {
  children: React.ReactNode
}

export function MdxGallery(props: MdxGalleryProps) {
  const { children } = props

  const imagesRef = useRef(new Map<HTMLButtonElement, GalleryImage>())
  const [Viewer, setViewer] = useState<ComponentType<MdxLightboxProps> | null>(null)
  const [slides, setSlides] = useState<GalleryImage[]>([])
  const [index, setIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState<string | null>(null)
  const requestRef = useRef(0)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  useEffect(
    () => () => {
      requestRef.current += 1
    },
    [],
  )
  const register = useCallback((trigger: HTMLButtonElement, image: GalleryImage) => {
    imagesRef.current.set(trigger, image)
    return () => {
      imagesRef.current.delete(trigger)
    }
  }, [])
  const open = useCallback(
    async function open(button: HTMLButtonElement) {
      const image = imagesRef.current.get(button)
      if (!image) return
      const collection = [...imagesRef.current.values()]
      const next = collection.indexOf(image)
      triggerRef.current = button
      setSlides(collection)
      setFailed(null)
      requestRef.current += 1
      const current = requestRef.current
      if (Viewer) {
        setIndex(next)
        return
      }
      setLoading(true)
      try {
        const module = await import('./mdx-lightbox')
        if (current !== requestRef.current) return
        setViewer(() => module.default)
        setIndex(next)
      } catch {
        if (current === requestRef.current) setFailed(image.src)
      } finally {
        if (current === requestRef.current) setLoading(false)
      }
    },
    [Viewer],
  )
  const context = useMemo(() => ({ register, open, loading }), [register, open, loading])
  function close() {
    setIndex(null)
    triggerRef.current?.focus({ preventScroll: true })
  }

  return (
    <GalleryContext value={context}>
      {children}
      {loading && <output className='sr-only'>{m.common_loading()}</output>}
      {failed && (
        <p role='alert' className='text-base/relaxed text-foreground [&_a]:underline'>
          {m.common_error()}{' '}
          <a href={failed} target='_blank' rel='noopener noreferrer'>
            {m.blog_image_viewer_original()}
          </a>
        </p>
      )}
      {Viewer && index !== null && <Viewer images={slides} index={index} close={close} />}
    </GalleryContext>
  )
}
