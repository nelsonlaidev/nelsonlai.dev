import { cn } from 'cn'

type AspectRatioProps = {
  ratio: number
} & React.ComponentProps<'div'>

export function AspectRatio(props: AspectRatioProps) {
  const { ratio, className, style, ...rest } = props

  return (
    <div
      data-slot='aspect-ratio'
      style={{
        '--ratio': ratio,
        ...style,
      }}
      className={cn('relative aspect-(--ratio)', className)}
      {...rest}
    />
  )
}
