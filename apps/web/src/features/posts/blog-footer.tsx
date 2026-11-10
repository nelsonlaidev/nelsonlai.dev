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
          className='inline-flex items-center gap-2 text-sm/normal text-link hover:text-foreground'
        >
          {m.blog_footer_edit_on_github()} <ArrowUpRightIcon size={16} aria-hidden='true' />
        </ExternalLink>
      </div>
      <div className='mt-11 border-t pt-11 text-center'>
        <span className='mb-5 inline-block h-px w-7 bg-primary' />
        <p className='font-serif text-2xl/relaxed text-primary italic'>
          {m.blog_thanks()}
          <br />
          {m.blog_discovery()}
        </p>
        {children}
        <a href='#comments' className='mt-7 inline-flex items-center gap-3.5 text-sm/normal text-link'>
          {m.blog_join()} <ArrowUpRightIcon size={18} aria-hidden='true' />
        </a>
      </div>
    </>
  )
}
