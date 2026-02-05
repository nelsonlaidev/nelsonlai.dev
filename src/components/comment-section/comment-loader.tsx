import { cn } from '@/utils/cn'

import { Spinner } from '../ui/spinner'

function CommentLoader(props: React.ComponentProps<'div'>) {
  const { className, ...rest } = props

  return (
    <div className={cn('flex min-h-20 items-center justify-center', className)} {...rest}>
      <Spinner />
    </div>
  )
}

export default CommentLoader
