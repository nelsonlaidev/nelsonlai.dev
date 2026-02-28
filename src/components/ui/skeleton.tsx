import { cn } from '@/utils/cn'

type SkeletonProps = React.ComponentProps<'div'>

export function Skeleton(props: SkeletonProps) {
  const { className, ...rest } = props

  return <div data-slot='skeleton' className={cn('animate-pulse rounded-xl bg-muted', className)} {...rest} />
}
