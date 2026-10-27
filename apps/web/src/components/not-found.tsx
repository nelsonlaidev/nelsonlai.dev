import { buttonVariants } from '@repo/ui/components/button'
import { Link } from '@tanstack/react-router'
import { cn } from 'cn'

import { m } from '@/paraglide/messages'

export function NotFound() {
  return (
    <div className='mt-52 mb-40 flex flex-col items-center justify-center gap-12'>
      <h1 className='text-center text-6xl font-semibold'>{m.error_not_found()}</h1>
      <Link to='/' className={cn(buttonVariants())}>
        {m.components_go_to_homepage()}
      </Link>
    </div>
  )
}
