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

  let countsContent: React.ReactNode = (
    <>
      <span>
        <PendingCount>
          <NumberFlow value={100} />
        </PendingCount>{' '}
        {m.blog_comments_comments({ count: 0 })}
      </span>
      <i className='px-2.5 text-muted-foreground not-italic'>·</i>
      <span>
        <PendingCount>
          <NumberFlow value={100} />
        </PendingCount>{' '}
        {m.blog_comments_replies({ count: 0 })}
      </span>
    </>
  )

  if (counts.data) {
    countsContent = (
      <>
        <span>
          <NumberFlow data-testid='blog-comment-count' value={counts.data.comments} />{' '}
          {m.blog_comments_comments({ count: counts.data.comments })}
        </span>
        <i className='px-2.5 text-muted-foreground not-italic'>·</i>
        <span>
          <NumberFlow data-testid='reply-count' value={counts.data.replies} />{' '}
          {m.blog_comments_replies({ count: counts.data.replies })}
        </span>
      </>
    )
  } else if (counts.isError) {
    countsContent = m.common_error()
  }

  return (
    <section
      id='comments'
      className='scroll-mt-11 space-y-6 border-t pt-8 sm:pt-10'
      aria-label={m.common_labels_comments()}
    >
      <header className='mb-6'>
        <h2 className='mb-4 text-3xl font-medium tracking-tight'>{m.blog_comments_conversation()}</h2>
        <p className='mb-6 text-muted-foreground'>{m.blog_comments_discussion_intro()}</p>
      </header>
      <CommentComposer slug={slug} />
      <div className='flex flex-wrap items-center justify-between gap-3'>
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
              <DropdownMenuRadioItem value='newest' closeOnClick>
                {m.blog_comments_newest()}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='oldest' closeOnClick>
                {m.blog_comments_oldest()}
              </DropdownMenuRadioItem>
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
