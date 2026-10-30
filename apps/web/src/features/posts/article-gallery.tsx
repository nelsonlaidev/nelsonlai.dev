import '@/styles/viewer.css'

import type { ComponentType } from 'react'
import type { ArticleLightboxProps } from './article-lightbox'

import { createContext, use, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { m } from '@/paraglide/messages'

export type ArticleImage = { src: string; alt?: string; width?: number; height?: number }
const GalleryContext = createContext<{
  register: (image: ArticleImage) => () => void
  open: (src: string, trigger: HTMLButtonElement) => void
  loading: boolean
} | null>(null)
GalleryContext.displayName = 'ArticleGallery'
export const useArticleGallery = () => use(GalleryContext)

export function ArticleGallery(props: { children: React.ReactNode }) {
  const imagesRef = useRef(new Map<string, ArticleImage>())
  const [Viewer, setViewer] = useState<ComponentType<ArticleLightboxProps> | null>(null)
  const [slides, setSlides] = useState<ArticleImage[]>([])
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
  const register = useCallback((image: ArticleImage) => {
    imagesRef.current.set(image.src, image)
    return () => {
      imagesRef.current.delete(image.src)
    }
  }, [])
  const open = useCallback(
    async function open(src: string, button: HTMLButtonElement) {
      const collection = [...imagesRef.current.values()]
      const next = collection.findIndex((image) => image.src === src)
      if (next === -1) return
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
        const module = await import('./article-lightbox')
        if (current !== requestRef.current) return
        setViewer(() => module.default)
        setIndex(next)
      } catch {
        if (current === requestRef.current) setFailed(src)
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
      {props.children}
      {loading && <output className='sr-only'>{m.common_loading()}</output>}
      {failed && (
        <p role='alert' className='text-base/[1.6] text-[#e7eee5] [&_a]:underline'>
          {m.common_error()}{' '}
          <a href={failed} target='_blank' rel='noopener noreferrer'>
            {m.ocean_viewer_original()}
          </a>
        </p>
      )}
      {Viewer && index !== null && <Viewer images={slides} index={index} close={close} />}
    </GalleryContext>
  )
}
