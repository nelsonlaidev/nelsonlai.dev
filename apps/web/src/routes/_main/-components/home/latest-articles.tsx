import type { PostSummary } from '@/features/posts/types'

import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'

import { QueryErrorMessage } from '@/components/query-error-message'
import { PostCounts } from '@/features/posts/post-counts'
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
          {query.isLoadingError && <QueryErrorMessage query={query} className='pt-8' />}
          {posts.map((post) => (
            <ArticleRow key={post.slug} post={post} statsQuery={query} />
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
  statsQuery: ReturnType<typeof usePostStats>
}

function ArticleRow(props: ArticleRowProps) {
  const { post, statsQuery } = props
  const date = useFormattedDate(post.publishedAt)

  return (
    <article className='border-b'>
      <Link to='/blog/$slug' params={{ slug: post.slug }} className='group flex items-center gap-4 py-8'>
        <div className='min-w-0 flex-1'>
          <div className='mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground'>
            <time dateTime={post.publishedAt} className='text-primary'>
              {date ?? '--'}
            </time>
            <PostCounts slug={post.slug} query={statsQuery} />
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
