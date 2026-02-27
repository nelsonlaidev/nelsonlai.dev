import { useId } from 'react'

import { cn } from '@/utils/cn'

type GradientBackgroundProps = {
  position?: 'top' | 'bottom'
} & React.ComponentProps<'div'>

export function GradientBackground(props: GradientBackgroundProps) {
  const { position = 'top', className, ...rest } = props

  const id = useId()
  const orangeId = `orange-${id}`
  const redId = `red-${id}`
  const blueId = `blue-${id}`

  return (
    <div
      data-position={position}
      className={cn(
        'absolute left-1/2 -z-10 w-full max-w-300 -translate-x-1/2 data-[position=bottom]:bottom-0 data-[position=top]:top-0 data-[position=bottom]:[&>svg]:rotate-180',
        className,
      )}
      {...rest}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        fill='none'
        viewBox='0 0 1440 550'
        preserveAspectRatio='xMidYMid meet'
      >
        <g filter={`url(#${orangeId})`}>
          <ellipse cx='898.121' cy='7.207' fill='#FFB800' fillOpacity='.43' rx='284.881' ry='69.058' />
        </g>
        <g filter={`url(#${redId})`}>
          <ellipse cx='727.789' cy='48.819' fill='#E93F3F' fillOpacity='.43' rx='284.881' ry='131.671' />
        </g>
        <g filter={`url(#${blueId})`}>
          <ellipse cx='504.666' cy='27.364' fill='#3F64E9' fillOpacity='.43' rx='284.881' ry='89.316' />
        </g>
        <defs>
          <Filter id={orangeId} width='1042.08' height='610.439' x='377.079' y='-298.012' />
          <Filter id={redId} width='1042.08' height='735.665' x='206.747' y='-319.013' />
          <Filter id={blueId} width='1042.08' height='650.953' x='-16.376' y='-298.113' />
        </defs>
      </svg>
    </div>
  )
}

type FilterProps = React.ComponentProps<'filter'>

function Filter(props: FilterProps) {
  return (
    <filter colorInterpolationFilters='sRGB' filterUnits='userSpaceOnUse' {...props}>
      <feFlood floodOpacity='0' result='BackgroundImageFix' />
      <feBlend in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
      <feGaussianBlur result='blur' stdDeviation='118.081' />
    </filter>
  )
}
