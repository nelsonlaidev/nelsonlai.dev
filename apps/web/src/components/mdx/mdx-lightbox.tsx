/* oxlint-disable better-tailwindcss/no-unknown-classes -- YARL supplies these library CSS hooks. */
import 'yet-another-react-lightbox/styles.css'
import '@/styles/viewer.css'

import type { KeyboardEvent } from 'react'
import type { GalleryImage } from './mdx-gallery'

import { useEffect, useRef, useState } from 'react'
import Lightbox, { useController } from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'

import { m } from '@/paraglide/messages'

export type MdxLightboxProps = {
  images: GalleryImage[]
  index: number
  close: () => void
}

type IconProps = {
  kind: 'close' | 'prev' | 'next' | 'in' | 'out'
}

function Icon(props: IconProps) {
  const { kind } = props

  return (
    <svg
      className='yarl__icon pointer-events-none block size-6!'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
      focusable='false'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      {kind === 'close' && <path d='m6 6 12 12M18 6 6 18' />}
      {kind === 'prev' && <path d='m15.5 5-7 7 7 7' />}
      {kind === 'next' && <path d='m8.5 5 7 7-7 7' />}
      {(kind === 'in' || kind === 'out') && (
        <>
          <circle cx='10.5' cy='10.5' r='6.5' />
          <path d='m16 16 4 4M7.5 10.5h6' />
          {kind === 'in' && <path d='M10.5 7.5v6' />}
        </>
      )}
    </svg>
  )
}

function CloseControl() {
  const { close } = useController()
  const closingRef = useRef(false)
  const closeOnce = () => {
    if (!closingRef.current) {
      closingRef.current = true
      close()
    }
  }

  return (
    <button
      type='button'
      className='yarl__button'
      aria-label={m.common_labels_close()}
      title={m.common_labels_close()}
      onClick={closeOnce}
      onPointerUp={(event) => {
        // Touch browsers can suppress the compatibility click after a pinch/resize.
        // A release inside the control closes once; a subsequent click is harmless.
        if (event.pointerType !== 'touch') return
        const rect = event.currentTarget.getBoundingClientRect()
        if (
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
        )
          closeOnce()
      }}
    >
      <Icon kind='close' />
    </button>
  )
}

function trapFocus(event: KeyboardEvent<HTMLDivElement>) {
  if (event.key !== 'Tab') return
  const controls = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')].filter(
    (button) => button.offsetParent !== null,
  )
  if (controls.length === 0) return
  event.preventDefault()
  event.stopPropagation()
  const current = controls.indexOf(document.activeElement as HTMLButtonElement)
  let next = (current + (event.shiftKey ? -1 : 1) + controls.length) % controls.length
  if (current === -1) next = event.shiftKey ? controls.length - 1 : 0

  controls[next]?.focus({ preventScroll: true })
}

export default function MdxLightbox(props: MdxLightboxProps) {
  const { images, index, close } = props
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      setReduced(media.matches)
    }
    media.addEventListener('change', update)
    return () => {
      media.removeEventListener('change', update)
    }
  }, [])

  return (
    <Lightbox
      open
      close={close}
      index={index}
      slides={images}
      plugins={[Zoom]}
      className='mdx-lightbox'
      portal={{ container: { onKeyDownCapture: trapFocus } }}
      controller={{ closeOnEscape: true, closeOnBackdropClick: false }}
      carousel={{ finite: true, preload: 1, padding: '0px', imageFit: 'contain' }}
      zoom={{ maxZoomPixelRatio: 1, zoomInMultiplier: 1.5, doubleClickMaxStops: 2 }}
      animation={{ fade: reduced ? 0 : 160, swipe: reduced ? 0 : 220, zoom: reduced ? 0 : 180 }}
      labels={{
        Lightbox: m.blog_image_viewer_images(),
        Close: m.common_labels_close(),
        Previous: m.blog_image_viewer_previous(),
        Next: m.blog_image_viewer_next(),
        'Zoom in': m.blog_image_viewer_zoom_in(),
        'Zoom out': m.blog_image_viewer_zoom_out(),
      }}
      render={{
        buttonClose: () => <CloseControl key='close' />,
        iconPrev: () => <Icon kind='prev' />,
        iconNext: () => <Icon kind='next' />,
        iconZoomIn: () => <Icon kind='in' />,
        iconZoomOut: () => <Icon kind='out' />,
        iconError: () => <output className='text-base text-link'>{m.common_error()}</output>,
        slideFooter: ({ slide }) => (
          <div className='pointer-events-none absolute inset-x-20 bottom-[max(--spacing(8),env(safe-area-inset-bottom))] mx-auto w-fit bg-backdrop/95 px-2.5 py-1 text-center text-base/normal wrap-anywhere text-link md:bottom-[max(--spacing(5),env(safe-area-inset-bottom))]'>
            {slide.alt}
          </div>
        ),
        ...(images.length < 2 ? { buttonPrev: () => null, buttonNext: () => null } : {}),
      }}
    />
  )
}
