import type { PostDetail } from './types'

import NumberFlow from '@number-flow/react'
import { ExternalLink } from '@repo/ui/components/external-link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

import { PendingCount } from '@/components/pending-count'
import { useFormattedDate } from '@/hooks/use-formatted-date'
import { orpc } from '@/lib/orpc-client'
import { SITE } from '@/lib/site'
import { m } from '@/paraglide/messages'

import { usePostStats } from './use-post-stats'

type BlogHeaderProps = {
  post: PostDetail
}

export function BlogHeader(props: BlogHeaderProps) {
  const { post } = props
  const formattedDate = useFormattedDate(post.publishedAt)
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

  const pendingCount = (
    <PendingCount>
      <NumberFlow value={100} />
    </PendingCount>
  )
  let viewsContent: React.ReactNode = stats.isPending ? pendingCount : '--'
  let commentsContent: React.ReactNode = pendingCount

  if (postStats) {
    viewsContent = <NumberFlow data-testid='view-count' value={postStats.views} />
  } else if (stats.isError) {
    viewsContent = m.common_error()
  }

  if (counts.data) {
    commentsContent = <NumberFlow data-testid='comment-count' value={counts.data.comments + counts.data.replies} />
  } else if (counts.isError) {
    commentsContent = m.common_error()
  }

  return (
    <header className='mb-10 sm:mb-12'>
      <h1 className='mb-3 text-3xl tracking-tight text-balance sm:text-4xl/tight lg:text-5xl/tight'>{post.title}</h1>
      <p className='mb-6 leading-relaxed text-muted-foreground sm:text-lg'>{post.description}</p>
      <div className='flex items-center gap-3 text-sm text-muted-foreground'>
        <img src='/images/avatar.png' alt='' width={36} height={36} className='size-9 shrink-0 rounded-full' />
        <div className='grid gap-1'>
          <div className='flex flex-wrap items-baseline gap-x-2'>
            <ExternalLink href={SITE.socials.github} className='font-medium text-foreground'>
              {SITE.name}
            </ExternalLink>
            <span aria-hidden='true'>·</span>
            <time dateTime={post.publishedAt}>
              <span className='sr-only'>{m.blog_header_published_on()} </span>
              {formattedDate ?? '--'}
            </time>
          </div>
          <div className='flex items-baseline gap-2 text-xs'>
            <span>
              {viewsContent} {m.blog_header_views()}
            </span>
            <span aria-hidden='true'>·</span>
            <span>
              {commentsContent} {m.common_labels_comments()}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
