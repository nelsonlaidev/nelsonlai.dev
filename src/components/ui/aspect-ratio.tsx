import { cn } from '@/utils/cn'

type AspectRatioProps = React.ComponentProps<'div'> & { ratio: number }

function AspectRatio(props: AspectRatioProps) {
  const { ratio, className, ...rest } = props

  return (
    <div
      data-slot='aspect-ratio'
      style={{
        '--ratio': ratio,
      }}
      className={cn('relative aspect-(--ratio)', className)}
      {...rest}
    />
  )
}

export { AspectRatio }
