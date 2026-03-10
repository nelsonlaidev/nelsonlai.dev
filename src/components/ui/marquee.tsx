import { cn } from '@/utils/cn'

type MarqueeProps = {
  children: React.ReactNode
  gap?: string
  duration?: number
  direction?: 'left' | 'up'
  pauseOnHover?: boolean
  fade?: boolean
  reverse?: boolean
  className?: string
}

export function Marquee(props: MarqueeProps) {
  const {
    children,
    gap = '1rem',
    duration = 30,
    direction = 'left',
    pauseOnHover = true,
    fade = true,
    reverse = false,
    className,
  } = props

  const maskDirection = direction === 'left' ? 'to right' : 'to bottom'
  const mask = fade
    ? `linear-gradient(${maskDirection}, transparent 0%, rgba(0, 0, 0, 1.0) 10%, rgba(0, 0, 0, 1.0) 90%, transparent 100%)`
    : undefined

  return (
    <div
      data-slot='marquee'
      data-direction={direction}
      data-pause-on-hover={pauseOnHover}
      data-reverse={reverse}
      className={cn(
        'group flex overflow-hidden data-[direction=left]:flex-row data-[direction=up]:flex-col',
        className,
      )}
      style={{
        maskImage: mask,
        WebkitMaskImage: mask,
        gap,
      }}
    >
      {Array.from({ length: 2 }).map((_index, number) => (
        <div
          key={number}
          style={{
            '--marquee-gap': gap,
            '--marquee-duration': `${duration}s`,
          }}
          className='flex shrink-0 justify-around gap-(--marquee-gap) group-data-[direction=left]:animate-marquee-x group-data-[direction=left]:flex-row group-data-[direction=up]:animate-marquee-y group-data-[direction=up]:flex-col group-data-[pause-on-hover=true]:group-hover:paused group-data-[reverse=true]:direction-reverse'
        >
          {children}
        </div>
      ))}
    </div>
  )
}
