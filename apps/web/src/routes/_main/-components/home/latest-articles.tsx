import type { PostSummary } from '@/features/posts/types'

import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'

import { useFormattedDate } from '@/hooks/use-formatted-date'
import { m } from '@/paraglide/messages'

import { SectionHeading } from './section-heading'

type LatestArticlesProps = {
  posts: PostSummary[]
}

export function LatestArticles(props: LatestArticlesProps) {
  const { posts } = props

  return (
    <section
      id='notes'
      aria-labelledby='notes-title'
      className='mx-auto grid w-full max-w-400 scroll-mt-12.5 gap-10 pt-30 pr-[max(16px,env(safe-area-inset-right))] pb-27.5 pl-[max(16px,env(safe-area-inset-left))] min-[701px]:scroll-mt-17.5 min-[701px]:grid-cols-[1fr_1.05fr] min-[701px]:items-center min-[701px]:gap-17.5 min-[701px]:px-[10%] min-[701px]:py-47.5'
    >
      <SectionHeading
        id='notes-title'
        eyebrow={`02 / ${m.nav_blog()}`}
        title={m.ocean_notes_title()}
        emphasis={m.ocean_notes_emphasis()}
        description={m.ocean_notes_description()}
      />
      <div className='min-w-0'>
        <div className='border-t'>
          {posts.map((post, index) => (
            <ArticleRow key={post.slug} post={post} index={index} />
          ))}
        </div>
        {posts.length === 0 && <p className='py-8 text-muted-foreground'>{m.ocean_empty_notes()}</p>}
        <Link to='/blog' className='mt-8 inline-flex min-h-11 items-center gap-3 text-sm text-primary'>
          {m.ocean_all_articles()}
          <ArrowRightIcon className='size-5' aria-hidden='true' />
        </Link>
      </div>
    </section>
  )
}

type ArticleRowProps = {
  post: PostSummary
  index: number
}

function ArticleRow(props: ArticleRowProps) {
  const { post, index } = props
  const date = useFormattedDate(post.publishedAt)

  return (
    <article className='border-b'>
      <Link to='/blog/$slug' params={{ slug: post.slug }} className='group flex items-center gap-4 py-7.5'>
        <span className='text-sm text-muted-foreground' aria-hidden='true'>
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className='min-w-0 flex-1'>
          <time dateTime={post.publishedAt} className='text-sm text-primary'>
            {m.article_category()} · {date ?? '--'}
          </time>
          <h3 className='mt-3 text-lg/normal font-normal tracking-tight min-[701px]:text-xl/normal'>{post.title}</h3>
          <p className='mt-3 text-base/[1.65] text-muted-foreground'>{post.description}</p>
        </div>
        <ArrowRightIcon
          className='size-5 shrink-0 text-primary transition-transform motion-safe:group-hover:translate-x-1 motion-reduce:transition-none'
          aria-hidden='true'
        />
      </Link>
    </article>
  )
}
