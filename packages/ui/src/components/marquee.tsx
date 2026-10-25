import { cn } from 'cn'

type MarqueeProps = React.ComponentProps<'div'> & {
  children: React.ReactNode
  gap?: string
  duration?: number
  direction?: 'left' | 'up'
  pauseOnHover?: boolean
  fade?: boolean
  reverse?: boolean
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
    style,
    ...rest
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
        'group/marquee flex overflow-hidden data-[direction=left]:flex-row data-[direction=up]:flex-col',
        className,
      )}
      style={{
        '--marquee-gap': gap,
        '--marquee-duration': `${duration}s`,
        maskImage: mask,
        WebkitMaskImage: mask,
        gap,
        ...style,
      }}
      {...rest}
    >
      {Array.from({ length: 2 }, (_element, index) => index).map((number) => (
        <div
          key={number}
          className={cn(
            'flex shrink-0 justify-around gap-(--marquee-gap)',
            'group-data-[direction=left]/marquee:animate-marquee-x group-data-[direction=left]/marquee:flex-row',
            'group-data-[direction=up]/marquee:animate-marquee-y group-data-[direction=up]/marquee:flex-col',
            'group-data-[pause-on-hover=true]/marquee:group-hover/marquee:paused group-data-[reverse=true]/marquee:direction-reverse',
            'motion-reduce:animate-none motion-reduce:last:hidden',
          )}
        >
          {children}
        </div>
      ))}
    </div>
  )
}
