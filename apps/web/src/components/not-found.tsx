import { buttonVariants } from '@repo/ui/components/button'
import { Link } from '@tanstack/react-router'
import { cn } from 'cn'
import { ArrowUpRightIcon } from 'lucide-react'

import { m } from '@/paraglide/messages'

export function NotFound() {
  return (
    <div className='mt-52 mb-40 flex flex-col items-center justify-center gap-12'>
      <h1 className='text-center text-6xl font-semibold'>{m.error_not_found()}</h1>
      <Link to='/' className={cn(buttonVariants())}>
        {m.common_go_to_homepage()}
      </Link>
    </div>
  )
}

export function PublicNotFound() {
  return (
    <div className='relative mx-auto my-0 block min-h-[85vh] w-full overflow-hidden px-[max(16px,10%)] pt-55 pb-25 text-center wrap-anywhere subpixel-antialiased max-[541px]:px-4 max-[541px]:pt-47.5 max-[541px]:pb-20'>
      <span className='text-xs/normal text-[#b4cec4]'>{m.not_found_eyebrow()}</span>
      <span
        aria-hidden='true'
        className='pointer-events-none absolute top-[43%] left-1/2 block transform-[translate(-50%,-50%)] font-serif text-[clamp(230px,40vw,480px)] leading-normal -tracking-widest text-[#9ac6b407]'
      >
        404
      </span>
      <h1 className='relative mt-0 text-[clamp(40px,5.8vw,86px)] leading-[1.04] font-[420] tracking-[-0.065em] text-[#edf3e8] max-[541px]:text-[53px]'>
        {m.not_found_title()}
        <br />
        <em className='font-serif font-normal text-primary'>{m.not_found_emphasis()}</em>
      </h1>
      <p className='relative mx-auto mt-7.5 mb-0 max-w-117.5 text-base/[1.65] text-[#a3c0b4]'>
        {m.not_found_description()}
      </p>
      <div className='relative mt-10 flex flex-wrap items-center justify-center gap-7.5'>
        <Link
          to='/'
          className={cn(
            buttonVariants(),
            'h-auto min-h-12 rounded-md border border-[#a7cabb65] bg-[#b0d3c30b] px-5.75 py-3.5 text-sm/normal whitespace-normal text-[#e0ecde] hover:border-[#b0d3c3] hover:bg-[#b0d3c31c]',
          )}
        >
          {m.common_go_to_homepage()}
          <ArrowUpRightIcon aria-hidden='true' className='size-4' />
        </Link>
        <Link to='/projects' className='inline-flex min-h-11 items-center gap-4 text-sm/normal text-[#b9d3c7]'>
          {m.nav_projects()}
          <ArrowUpRightIcon aria-hidden='true' className='size-4' />
        </Link>
      </div>
    </div>
  )
}
