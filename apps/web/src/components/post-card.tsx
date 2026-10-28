import type { PostStats, PostSummary } from '@/features/posts/types'

import { PencilIcon } from 'lucide-react'

import { useFormattedDate } from '@/hooks/use-formatted-date'
import { m } from '@/paraglide/messages'

import { ContentCard } from './content-card'

type PostCardProps = {
  post: PostSummary
  stats?: PostStats
  isStatsError?: boolean
  featured?: boolean
  lazy?: boolean
}

export function PostCard(props: PostCardProps) {
  const { post, stats, isStatsError = false, featured = false, lazy = true } = props
  const formattedDate = useFormattedDate(post.publishedAt)

  let statsContent: React.ReactNode = '--'

  if (stats) {
    statsContent = (
      <>
        <span>{m.common_likes({ count: stats.likes })}</span>
        <span aria-hidden='true'>&middot;</span>
        <span>{m.common_views({ count: stats.views })}</span>
      </>
    )
  } else if (isStatsError) {
    statsContent = m.common_error()
  }

  return (
    <ContentCard
      to={`/blog/${post.slug}`}
      title={m.article_category()}
      image={`/images/blog/${post.slug}/cover.png`}
      imageAlt=''
      icon={<PencilIcon className='size-4.5' aria-hidden='true' />}
      featured={featured}
      lazy={lazy}
    >
      <div className='flex flex-wrap items-center justify-between gap-x-2 gap-y-1 px-2 pt-4 text-sm text-muted-foreground'>
        <time dateTime={post.publishedAt}>{formattedDate ?? '--'}</time>
        <div className='flex gap-2'>{statsContent}</div>
      </div>
      <div className='flex flex-col px-2 py-4 transition-transform ease-out motion-safe:group-hover:translate-x-0.5 motion-reduce:transition-none'>
        <h3 className='text-2xl font-semibold'>{post.title}</h3>
        <p className='mt-2 text-muted-foreground'>{post.description}</p>
      </div>
    </ContentCard>
  )
}
