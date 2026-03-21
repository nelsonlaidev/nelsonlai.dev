'use client'

import createGlobe from 'cobe'
import { MapPinIcon } from 'lucide-react'
import { useMotionValue, useSpring } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'

export function LocationCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dragOriginXRef = useRef<number | null>(null)
  const dragDeltaRef = useRef(0)
  const fadeMask = 'radial-gradient(circle at 50% 50%, rgb(0, 0, 0) 60%, rgb(0, 0, 0, 0) 70%)'
  const t = useTranslations()

  const rotation = useMotionValue(0)
  const springRotation = useSpring(rotation, {
    stiffness: 280,
    damping: 40,
    mass: 1,
  })

  useEffect(() => {
    let width = 0

    function onResize() {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth
      }
    }

    onResize()
    window.addEventListener('resize', onResize)

    if (!canvasRef.current) return

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 2,
      mapSamples: 16_000,
      mapBrightness: 2,
      baseColor: [0.8, 0.8, 0.8],
      markerColor: [1, 1, 1],
      glowColor: [0.5, 0.5, 0.5],
      markers: [{ location: [22.3193, 114.1694], size: 0.1 }],
      scale: 1.05,
      onRender: (state) => {
        state.phi = 2.75 + springRotation.get() // oxlint-disable-line react-x/immutability
        state.width = width * 2 // oxlint-disable-line react-x/immutability
        state.height = width * 2 // oxlint-disable-line react-x/immutability
      },
    })

    return () => {
      globe.destroy()
      window.removeEventListener('resize', onResize)
    }
  }, [springRotation])

  return (
    <div className='relative flex h-60 flex-col gap-6 overflow-hidden rounded-2xl p-4 shadow-feature-card lg:p-6'>
      <div className='flex items-center gap-2'>
        <MapPinIcon className='size-4.5' />
        <h2 className='text-sm'>{t('homepage.about-me.location')}</h2>
      </div>
      <div className='absolute inset-x-0 -bottom-44 mx-auto aspect-square h-84 lg:-bottom-48 lg:h-96'>
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            placeItems: 'center',
            placeContent: 'center',
            overflow: 'visible',
          }}
        >
          <div
            style={{
              width: '100%',
              aspectRatio: '1/1',
              maxWidth: 800,
              WebkitMaskImage: fadeMask,
              maskImage: fadeMask,
            }}
          >
            <canvas
              ref={canvasRef}
              onPointerDown={(e) => {
                dragOriginXRef.current = e.clientX - dragDeltaRef.current
                if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing'
              }}
              onPointerUp={() => {
                dragOriginXRef.current = null
                if (canvasRef.current) canvasRef.current.style.cursor = 'grab'
              }}
              onPointerOut={() => {
                dragOriginXRef.current = null
                if (canvasRef.current) canvasRef.current.style.cursor = 'grab'
              }}
              onMouseMove={(e) => {
                if (dragOriginXRef.current !== null) {
                  const delta = e.clientX - dragOriginXRef.current
                  dragDeltaRef.current = delta
                  rotation.set(delta / 200)
                }
              }}
              onTouchMove={(e) => {
                if (dragOriginXRef.current !== null && e.touches[0]) {
                  const delta = e.touches[0].clientX - dragOriginXRef.current
                  dragDeltaRef.current = delta
                  rotation.set(delta / 100)
                }
              }}
              style={{
                width: '100%',
                height: '100%',
                contain: 'layout paint size',
                cursor: 'auto',
                userSelect: 'none',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
