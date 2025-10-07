import { cn } from '@repo/ui/utils/cn'
import { LoaderIcon } from 'lucide-react'

const CommentLoader = (props: React.ComponentProps<'div'>) => {
  const { className, ...rest } = props

  return (
    <div className={cn('flex min-h-20 items-center justify-center', className)} {...rest}>
      <LoaderIcon className='size-4 animate-spin' />
    </div>
  )
}

export default CommentLoader
