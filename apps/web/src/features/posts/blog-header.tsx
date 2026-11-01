import type { PostDetail } from './types'

import NumberFlow from '@number-flow/react'
import { ExternalLink } from '@repo/ui/components/external-link'
import { useCspNonce } from '@repo/ui/components/ui-provider'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

import { useFormattedDate } from '@/hooks/use-formatted-date'
import { orpc } from '@/lib/orpc-client'
import { SITE } from '@/lib/site'
import { m } from '@/paraglide/messages'

import { articleNumber, articleTopic, articleTopicLabel } from './presentation'
import { usePostStats } from './use-post-stats'

type BlogHeaderProps = {
  post: PostDetail
}

export function BlogHeader(props: BlogHeaderProps) {
  const { post } = props
  const nonce = useCspNonce()
  const formattedDate = useFormattedDate(post.publishedAt)
  const updatedDate = useFormattedDate(post.updatedAt)
  const queryClient = useQueryClient()
  const stats = usePostStats([post.slug])
  const postStats = stats.data?.get(post.slug)
  const counts = useQuery(orpc.comments.counts.queryOptions({ input: { slug: post.slug } }))
  const hasIncrementedRef = useRef(false)
  const increment = useMutation(
    orpc.posts.incrementView.mutationOptions({
      onSuccess: async (data) => {
        const queryKey = orpc.posts.stats.queryKey({ input: { slugs: [post.slug] } })
        await queryClient.cancelQueries({ queryKey })
        queryClient.setQueryData(queryKey, [data])
        void queryClient.invalidateQueries({ queryKey: orpc.posts.stats.key() })
      },
    }),
  )

  useEffect(() => {
    if (!hasIncrementedRef.current) {
      hasIncrementedRef.current = true
      increment.mutate({ slug: post.slug })
    }
  }, [increment, post.slug])

  let viewsContent: React.ReactNode = '--'
  let commentsContent: React.ReactNode = '--'

  if (postStats) {
    viewsContent = <NumberFlow nonce={nonce} data-testid='view-count' value={postStats.views} />
  } else if (stats.isError) {
    viewsContent = m.common_error()
  }

  if (counts.data) {
    commentsContent = (
      <NumberFlow nonce={nonce} data-testid='comment-count' value={counts.data.comments + counts.data.replies} />
    )
  } else if (counts.isError) {
    commentsContent = m.common_error()
  }

  return (
    <header className='mb-16.25 max-w-225 max-[601px]:mb-10'>
      <span className='mb-6 block text-xs leading-[normal] tracking-[normal] text-section-label'>
        {articleTopicLabel(articleTopic(post.slug))} / {m.article_category()} {articleNumber(post.slug)}
      </span>
      <h1 className='text-[clamp(44px,5.2vw,76px)] leading-[1.1] font-[420] tracking-[-0.065em] max-[1001px]:text-[55px] max-[601px]:text-[42px] max-[601px]:leading-[1.12]'>
        {post.title}
      </h1>
      <p className='mt-6.75 max-w-180 text-lg/[1.65] text-[#a8c6bb]'>{post.description}</p>
      <div className='mt-8.75 flex flex-wrap items-center gap-3.25 text-sm/normal'>
        <span
          aria-hidden='true'
          className='grid size-9.5 shrink-0 place-items-center rounded-full border border-[#b6d1bc4a] font-serif text-[#c5dbc8] italic'
        >
          N
        </span>
        <div className='min-w-0 flex-1 max-[601px]:basis-[calc(100%-55px)]'>
          <ExternalLink href={SITE.socials.github}>{SITE.name}</ExternalLink>
          <div className='mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm leading-[1.6] text-[#8cafaa]'>
            <span className='block'>
              {m.blog_header_published_on()} <time dateTime={post.publishedAt}>{formattedDate ?? '--'}</time>
            </span>
            {post.updatedAt !== post.publishedAt && (
              <span className='block'>
                <time dateTime={post.updatedAt}>{m.blog_footer_last_updated({ date: updatedDate ?? '--' })}</time>
              </span>
            )}
          </div>
        </div>
        <div className='flex flex-wrap gap-4 text-sm/normal text-[#8cafaa] max-[601px]:basis-full max-[601px]:pl-12.75'>
          <span>
            {viewsContent} {m.blog_header_views()}
          </span>
          <a href='#comments'>
            {commentsContent} {m.common_labels_comments()}
          </a>
        </div>
      </div>
    </header>
  )
}
