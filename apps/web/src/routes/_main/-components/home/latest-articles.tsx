import type { PostStats, PostSummary } from '@/features/posts/types'

import { Link } from '@tanstack/react-router'
import { ArrowRightIcon, EyeIcon, HeartIcon } from 'lucide-react'
import { useFormatter } from 'use-intl'

import { PendingCount } from '@/components/pending-count'
import { usePostStats } from '@/features/posts/use-post-stats'
import { useFormattedDate } from '@/hooks/use-formatted-date'
import { m } from '@/paraglide/messages'

import { Section } from './section'
import { SectionHeading } from './section-heading'

type LatestArticlesProps = {
  posts: PostSummary[]
}

export function LatestArticles(props: LatestArticlesProps) {
  const { posts } = props
  const query = usePostStats(posts.map((post) => post.slug))

  return (
    <Section id='blog' className='grid gap-10 pt-32 pb-28 md:grid-cols-[1fr_1.05fr] md:items-center md:gap-16 md:py-48'>
      <SectionHeading
        id='blog-title'
        title={m.home_notes_title()}
        emphasis={m.home_notes_emphasis()}
        description={m.home_notes_description()}
      />
      <div className='min-w-0'>
        <div className='mb-8 border-t'>
          {posts.map((post) => (
            <ArticleRow key={post.slug} post={post} stats={query.data} isPending={query.isPending} />
          ))}
          {posts.length === 0 && <p className='py-8 text-muted-foreground'>{m.blog_empty()}</p>}
        </div>
        <Link to='/blog' className='group inline-flex items-center gap-2 text-sm text-primary'>
          {m.blog_all_articles()}
          <ArrowRightIcon
            className='size-5 motion-safe:transition-transform motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1'
            aria-hidden='true'
          />
        </Link>
      </div>
    </Section>
  )
}

type ArticleRowProps = {
  post: PostSummary
  isPending: boolean
  stats: Map<string, PostStats> | undefined
}

function ArticleRow(props: ArticleRowProps) {
  const { post, stats, isPending } = props
  const counts = stats?.get(post.slug)
  const fallback = isPending ? <PendingCount /> : '—'
  const format = useFormatter()
  const date = useFormattedDate(post.publishedAt)

  return (
    <article className='border-b'>
      <Link to='/blog/$slug' params={{ slug: post.slug }} className='group flex items-center gap-4 py-8'>
        <div className='min-w-0 flex-1'>
          <div className='mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground'>
            <time dateTime={post.publishedAt} className='text-primary'>
              {date ?? '--'}
            </time>
            <span className='inline-flex items-center gap-1'>
              <EyeIcon className='size-4' aria-hidden='true' />
              {stats ? format.number(counts?.views ?? 0) : fallback}{' '}
              <span className='sr-only'>{m.blog_header_views()}</span>
            </span>
            <span className='inline-flex items-center gap-1'>
              <HeartIcon className='size-4' aria-hidden='true' />
              {stats ? format.number(counts?.likes ?? 0) : fallback}{' '}
              <span className='sr-only'>{m.admin_dashboard_stats_likes()}</span>
            </span>
          </div>
          <h3 className='mb-3 text-lg tracking-tight md:text-xl'>{post.title}</h3>
          <p className='leading-relaxed text-muted-foreground'>{post.description}</p>
        </div>
        <ArrowRightIcon
          className='size-5 shrink-0 text-primary motion-safe:transition-transform motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1'
          aria-hidden='true'
        />
      </Link>
    </article>
  )
}
