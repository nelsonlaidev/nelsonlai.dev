'use client'

import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react'

import { cn } from '../utils/cn'

import { Button } from './button'

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselBaseProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselBaseProps

const CarouselContext = createContext<CarouselContextProps | null>(null)
CarouselContext.displayName = 'CarouselContext'

const useCarousel = () => {
  const context = use(CarouselContext)

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />')
  }

  return context
}

type CarouselProps = React.ComponentProps<'div'> & CarouselBaseProps

const Carousel = (props: CarouselProps) => {
  const { orientation = 'horizontal', opts, setApi, plugins, className, children, ...rest } = props
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === 'horizontal' ? 'x' : 'y'
    },
    plugins
  )
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback((a: CarouselApi) => {
    if (!a) return
    setCanScrollPrev(a.canScrollPrev())
    setCanScrollNext(a.canScrollNext())
  }, [])

  const scrollPrev = useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = useCallback(() => {
    api?.scrollNext()
  }, [api])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext]
  )

  useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on('reInit', onSelect)
    api.on('select', onSelect)

    return () => {
      api.off('select', onSelect)
    }
  }, [api, onSelect])

  const value = useMemo(
    () => ({
      carouselRef,
      api,
      opts,
      orientation,
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext
    }),
    [carouselRef, api, opts, orientation, scrollPrev, scrollNext, canScrollPrev, canScrollNext]
  )

  return (
    <CarouselContext value={value}>
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn('relative', className)}
        role='region'
        aria-roledescription='carousel'
        data-slot='carousel'
        {...rest}
      >
        {children}
      </div>
    </CarouselContext>
  )
}

type CarouselContentProps = React.ComponentProps<'div'>

const CarouselContent = (props: CarouselContentProps) => {
  const { className, ...rest } = props
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className='overflow-hidden' data-slot='carousel-content'>
      <div className={cn('flex', orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col', className)} {...rest} />
    </div>
  )
}

type CarouselItemProps = React.ComponentProps<'div'>

const CarouselItem = (props: CarouselItemProps) => {
  const { className, ...rest } = props
  const { orientation } = useCarousel()

  return (
    <div
      role='group'
      aria-roledescription='slide'
      data-slot='carousel-item'
      className={cn('min-w-0 shrink-0 grow-0 basis-full', orientation === 'horizontal' ? 'pl-4' : 'pt-4', className)}
      {...rest}
    />
  )
}

type CarouselPreviousProps = React.ComponentProps<typeof Button>

const CarouselPrevious = (props: CarouselPreviousProps) => {
  const { className, variant = 'outline', size = 'icon', ...rest } = props
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      data-slot='carousel-previous'
      variant={variant}
      size={size}
      className={cn(
        'absolute size-8 rounded-full',
        orientation === 'horizontal'
          ? 'top-1/2 -left-12 -translate-y-1/2'
          : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...rest}
    >
      <ArrowLeft />
      <span className='sr-only'>Previous slide</span>
    </Button>
  )
}

type CarouselNextProps = React.ComponentProps<typeof Button>

const CarouselNext = (props: CarouselNextProps) => {
  const { className, variant = 'outline', size = 'icon', ...rest } = props
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      data-slot='carousel-next'
      variant={variant}
      size={size}
      className={cn(
        'absolute size-8 rounded-full',
        orientation === 'horizontal'
          ? 'top-1/2 -right-12 -translate-y-1/2'
          : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...rest}
    >
      <ArrowRight />
      <span className='sr-only'>Next slide</span>
    </Button>
  )
}

export { Carousel, type CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious }
