import type { PostDetail } from './types'

import { ExternalLink, ExternalLinkArrow } from '@repo/ui/components/external-link'

import { useFormattedDate } from '@/hooks/use-formatted-date'
import { SITE } from '@/lib/site'
import { m } from '@/paraglide/messages'

type BlogFooterProps = {
  post: PostDetail
  children?: React.ReactNode
}

export function BlogFooter(props: BlogFooterProps) {
  const { post, children } = props
  const updatedDate = useFormattedDate(post.updatedAt)
  const editUrl = `${SITE.repository}/edit/main/apps/web/content/blog/${post.locale}/${post.slug}.mdx`

  return (
    <>
      <div className='mt-11 mb-7 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm'>
        <ExternalLink href={editUrl} className='inline-flex items-center gap-2 text-link hover:text-foreground'>
          {m.blog_footer_edit_on_github()} <ExternalLinkArrow className='size-4' />
        </ExternalLink>
        <time dateTime={post.updatedAt} className='text-muted-foreground'>
          {m.blog_footer_last_updated({ date: updatedDate ?? '--' })}
        </time>
      </div>
      <div className='border-t py-11 text-center sm:py-16'>
        <span className='mb-5 inline-block h-px w-7 bg-primary' />
        <p className='font-serif text-2xl/relaxed text-primary italic'>
          {m.blog_thanks()}
          <br />
          {m.blog_discovery()}
        </p>
        {children}
      </div>
    </>
  )
}
