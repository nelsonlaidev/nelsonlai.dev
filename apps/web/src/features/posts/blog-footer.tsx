import type { PostDetail } from './types'

import { ExternalLink } from '@repo/ui/components/external-link'
import { ArrowUpRightIcon } from 'lucide-react'

import { SITE } from '@/lib/site'
import { m } from '@/paraglide/messages'

type BlogFooterProps = {
  post: PostDetail
  children?: React.ReactNode
}

export function BlogFooter(props: BlogFooterProps) {
  const { post, children } = props
  const editUrl = `${SITE.repository}/blob/main/apps/web/content/blog/${post.locale}/${post.slug}.mdx?plain=1`

  return (
    <>
      <div className='mt-7'>
        <ExternalLink
          href={editUrl}
          className='inline-flex min-h-11 items-center gap-2 text-sm/normal text-[#a8c7b7] hover:text-[#d6eee3]'
        >
          {m.blog_footer_edit_on_github()} <ArrowUpRightIcon size={16} aria-hidden='true' />
        </ExternalLink>
      </div>
      <div className='mt-11 border-t border-t-border pt-11.25 text-center'>
        <span className='mb-5 inline-block h-px w-7 bg-[#b2d2be]' />
        <p className='font-serif text-2xl leading-[1.6] text-[#c5d7c5] italic'>
          {m.ocean_blog_thanks()}
          <br />
          {m.ocean_blog_discovery()}
        </p>
        {children}
        <a href='#comments' className='mt-7 inline-flex items-center gap-3.25 text-sm/normal text-[#9fc0aa]'>
          {m.ocean_blog_join()} <ArrowUpRightIcon size={18} aria-hidden='true' />
        </a>
      </div>
    </>
  )
}
