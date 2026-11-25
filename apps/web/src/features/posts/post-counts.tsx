import type { usePostStats } from './use-post-stats'

import { EyeIcon, HeartIcon } from 'lucide-react'
import { useFormatter } from 'use-intl'

import { PendingCount } from '@/components/pending-count'
import { m } from '@/paraglide/messages'

type PostCountsProps = {
  slug: string
  query: ReturnType<typeof usePostStats>
}

export function PostCounts(props: PostCountsProps) {
  const { slug, query } = props
  const counts = query.data?.get(slug)
  const fallback = query.isPending ? <PendingCount /> : '—'
  const format = useFormatter()

  return (
    <span className='inline-flex flex-wrap items-center gap-x-4 gap-y-1'>
      <span className='inline-flex items-center gap-1'>
        <EyeIcon className='size-4' aria-hidden='true' />
        {query.data ? format.number(counts?.views ?? 0) : fallback}{' '}
        <span className='sr-only'>{m.blog_header_views()}</span>
      </span>
      <span className='inline-flex items-center gap-1'>
        <HeartIcon className='size-4' aria-hidden='true' />
        {query.data ? format.number(counts?.likes ?? 0) : fallback}{' '}
        <span className='sr-only'>{m.admin_dashboard_stats_likes()}</span>
      </span>
    </span>
  )
}
