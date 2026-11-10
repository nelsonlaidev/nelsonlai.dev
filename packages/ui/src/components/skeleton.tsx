import { cn } from 'cn'
import { SkeletonBox } from 'skullet/react'

type SkeletonProps = React.ComponentProps<'div'>

export function Skeleton(props: SkeletonProps) {
  const { children, className, ...rest } = props

  return (
    <div data-slot='skeleton' className={cn('relative rounded-md bg-skeleton', className)} {...rest}>
      <SkeletonBox width='100%' height='100%' radius='inherit' className='pointer-events-none absolute inset-0' />
      {children}
    </div>
  )
}
