import type { PostDetail } from './types'

import { ExternalLink } from '@repo/ui/components/external-link'

import { useFormattedDate } from '@/hooks/use-formatted-date'
import { SITE } from '@/lib/site'
import { m } from '@/paraglide/messages'

type BlogFooterProps = { post: PostDetail }

export function BlogFooter(props: BlogFooterProps) {
  const { post } = props
  const formattedDate = useFormattedDate(post.updatedAt)
  const editUrl = `${SITE.repository}/blob/main/apps/web/content/blog/${post.locale}/${post.slug}.mdx?plain=1`

  return (
    <div className='my-8 flex flex-wrap items-center justify-between gap-3 py-4 text-sm text-muted-foreground'>
      <ExternalLink href={editUrl} className='transition-colors hover:text-foreground'>
        {m.blog_footer_edit_on_github()}
      </ExternalLink>
      <time dateTime={post.updatedAt}>{m.blog_footer_last_updated({ date: formattedDate ?? '--' })}</time>
    </div>
  )
}
