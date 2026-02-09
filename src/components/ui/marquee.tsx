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

function Marquee(props: MarqueeProps) {
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
      className={cn('group flex overflow-hidden', direction === 'left' ? 'flex-row' : 'flex-col', className)}
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
          className={cn(
            'flex shrink-0 justify-around gap-(--marquee-gap)',
            direction === 'left' ? 'animate-marquee-x flex-row' : 'animate-marquee-y flex-col',
            pauseOnHover && 'group-hover:paused',
            reverse && 'direction-reverse',
          )}
        >
          {children}
        </div>
      ))}
    </div>
  )
}

export { Marquee }
