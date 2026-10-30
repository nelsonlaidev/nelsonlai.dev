import type { ErrorComponentProps } from '@tanstack/react-router'

import { Link } from '@tanstack/react-router'
import { ArrowUpRightIcon } from 'lucide-react'

import { Mdx } from '@/components/mdx/mdx'
import { RouteError } from '@/components/route-error'
import { m } from '@/paraglide/messages'

type LegalPageProps = {
  page: { title: string; description: string; mdx: string }
  kind: 'terms' | 'privacy'
}

export function LegalPage(props: LegalPageProps) {
  const { page, kind } = props

  return (
    <div className='mx-auto my-0 min-h-[85vh] w-[84%] max-w-250 px-0 pt-41.25 pb-8.75 subpixel-antialiased max-[541px]:mr-[max(16px,env(safe-area-inset-right))] max-[541px]:ml-[max(16px,env(safe-area-inset-left))] max-[541px]:w-auto max-[541px]:pt-32.5'>
      <header className='mb-11 max-[541px]:mb-7.5'>
        <h1 className='text-[clamp(40px,5vw,68px)] leading-[1.1] font-normal tracking-[-0.045em] wrap-anywhere text-[#edf3e8]'>
          {page.title}
        </h1>
        <p className='mt-5.5 text-lg/[1.65] text-[#bfd5cc]'>{page.description}</p>
      </header>
      <article
        aria-label={page.title}
        className='border border-[#a6c9bc30] bg-[#062633] p-[clamp(24px,4vw,60px)] wrap-anywhere text-[#cfddd3] max-[541px]:-mr-[max(16px,env(safe-area-inset-right))] max-[541px]:-ml-[max(16px,env(safe-area-inset-left))] max-[541px]:border-x-0 max-[541px]:py-6 max-[541px]:pr-[max(16px,env(safe-area-inset-right))] max-[541px]:pl-[max(16px,env(safe-area-inset-left))]'
      >
        <Mdx
          code={page.mdx}
          className='max-w-none text-inherit prose-headings:font-medium prose-headings:text-[#edf3e8] prose-h2:mt-12 prose-h2:mb-5.5 prose-h2:text-[clamp(24px,3vw,30px)] prose-h2:leading-[1.3] prose-h2:tracking-tight prose-h3:mt-7.5 prose-h3:mb-4 prose-h3:text-xl prose-h3:leading-[1.4] prose-h4:mt-6.5 prose-h4:mb-4 prose-h4:text-lg/[1.4] prose-p:mt-0 prose-p:mb-6 prose-p:text-lg prose-p:leading-[1.7] max-[541px]:prose-p:text-[17px] prose-a:text-[#b6dfc9] prose-a:underline prose-a:underline-offset-4 prose-strong:font-semibold prose-strong:text-[#edf3e8] prose-ol:mt-0 prose-ol:mb-6 prose-ol:pl-6 prose-ul:mt-0 prose-ul:mb-6 prose-ul:pl-6 prose-li:my-0 prose-li:p-0 prose-li:text-lg prose-li:leading-[1.7] prose-li:not-first:mt-3 max-[541px]:prose-li:text-[17px] [&_li>p]:mb-3'
        />
        <nav className='mt-10 border-t border-t-[#a6c9bc30] pt-6 text-base/normal'>
          <Link
            to={kind === 'terms' ? '/privacy' : '/terms'}
            className='inline-flex min-h-11 items-center gap-3 text-[#b6dfc9] underline underline-offset-4'
          >
            {kind === 'terms' ? m.common_labels_privacy() : m.common_labels_terms()}
            <ArrowUpRightIcon className='size-4' aria-hidden='true' />
          </Link>
        </nav>
      </article>
    </div>
  )
}

export function LegalPending() {
  return (
    <div className='mx-auto my-0 min-h-[85vh] w-[84%] max-w-250 px-0 pt-41.25 pb-8.75 subpixel-antialiased max-[541px]:mr-[max(16px,env(safe-area-inset-right))] max-[541px]:ml-[max(16px,env(safe-area-inset-left))] max-[541px]:w-auto max-[541px]:pt-32.5'>
      <output aria-busy='true' className='block text-muted-foreground'>
        {m.common_loading()}
      </output>
    </div>
  )
}

export function LegalError(props: ErrorComponentProps) {
  return (
    <div className='mx-auto my-0 min-h-[85vh] w-[84%] max-w-250 px-0 pt-41.25 pb-8.75 subpixel-antialiased max-[541px]:mr-[max(16px,env(safe-area-inset-right))] max-[541px]:ml-[max(16px,env(safe-area-inset-left))] max-[541px]:w-auto max-[541px]:pt-32.5'>
      <RouteError {...props} />
    </div>
  )
}
