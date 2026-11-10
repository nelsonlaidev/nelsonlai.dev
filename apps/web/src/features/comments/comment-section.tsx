import NumberFlow, { NumberFlowGroup } from '@number-flow/react'
import { Button } from '@repo/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu'
import { useQuery } from '@tanstack/react-query'
import { ListFilterIcon } from 'lucide-react'
import { useState } from 'react'

import { PendingCount } from '@/components/pending-count'
import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

import { CommentComposer } from './comment-composer'
import { CommentList } from './comment-list'

type CommentSectionProps = {
  slug: string
  highlightedCommentId?: string
  highlightedReplyId?: string
}

export function CommentSection(props: CommentSectionProps) {
  const { slug, highlightedCommentId, highlightedReplyId } = props
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest')
  const counts = useQuery(orpc.comments.counts.queryOptions({ input: { slug } }))

  let total: React.ReactNode = <PendingCount />
  let countsContent: React.ReactNode = <PendingCount />

  if (counts.data) {
    total = counts.data.comments + counts.data.replies
    countsContent = (
      <>
        <NumberFlow data-testid='blog-comment-count' value={counts.data.comments} />{' '}
        {m.blog_comments_comments({ count: counts.data.comments })} ·{' '}
        <NumberFlow data-testid='reply-count' value={counts.data.replies} />{' '}
        {m.blog_comments_replies({ count: counts.data.replies })}
      </>
    )
  } else if (counts.isError) {
    total = '--'
    countsContent = m.common_error()
  }

  return (
    <section
      id='comments'
      className='mt-11 scroll-mt-11 space-y-6 border-t border-t-border pt-8 text-foreground/90 sm:mt-16 sm:pt-10'
      aria-label={m.common_labels_comments()}
    >
      <header className='mb-6'>
        <span className='mb-6 block text-xs text-section-label'>{m.blog_comments_discussion_kicker()}</span>
        <h2 className='mt-3 text-3xl/normal font-medium tracking-tighter'>
          {m.blog_comments_conversation()}
          <span className='ml-3.5 inline-flex h-8 min-w-8 items-center justify-center rounded-full border align-middle text-sm/normal text-primary'>
            {total}
          </span>
        </h2>
        <p className='mt-4 mb-6 text-base/relaxed text-muted-foreground'>{m.blog_comments_discussion_intro()}</p>
      </header>
      <CommentComposer slug={slug} />
      <div className='flex flex-wrap items-center justify-between gap-3 text-sm'>
        <NumberFlowGroup>
          <div>{countsContent}</div>
        </NumberFlowGroup>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button type='button' variant='outline' size='sm' />}>
            <ListFilterIcon aria-hidden='true' />
            {m.blog_comments_sort_by()}
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='border shadow-md ring-0'>
            <DropdownMenuRadioGroup
              value={sort}
              onValueChange={(value) => {
                if (value === 'newest' || value === 'oldest') setSort(value === 'newest' ? 'newest' : 'oldest')
              }}
            >
              <DropdownMenuRadioItem value='newest'>{m.blog_comments_newest()}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='oldest'>{m.blog_comments_oldest()}</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CommentList
        key={`${sort}:${highlightedCommentId}:${highlightedReplyId}`}
        slug={slug}
        sort={sort}
        highlightedCommentId={highlightedCommentId}
        highlightedReplyId={highlightedReplyId}
      />
    </section>
  )
}
