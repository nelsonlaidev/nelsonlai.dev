import NumberFlow, { NumberFlowGroup } from '@number-flow/react'
import { Button } from '@repo/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu'
import { useCspNonce } from '@repo/ui/components/ui-provider'
import { useQuery } from '@tanstack/react-query'
import { ListFilterIcon } from 'lucide-react'
import { useState } from 'react'

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
  const nonce = useCspNonce()
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest')
  const counts = useQuery(orpc.comments.counts.queryOptions({ input: { slug } }))

  let countsContent: React.ReactNode = '--'

  if (counts.data) {
    countsContent = (
      <>
        <NumberFlow nonce={nonce} data-testid='blog-comment-count' value={counts.data.comments} />{' '}
        {m.blog_comments_comments({ count: counts.data.comments })} ·{' '}
        <NumberFlow nonce={nonce} data-testid='reply-count' value={counts.data.replies} />{' '}
        {m.blog_comments_replies({ count: counts.data.replies })}
      </>
    )
  } else if (counts.isError) {
    countsContent = m.common_error()
  }

  return (
    <section
      id='comments'
      className='mt-16 scroll-mt-11.25 space-y-6 border-t border-t-[#a8d3c540] pt-10 text-[#dce8e1] max-[601px]:mt-11.25 max-[601px]:pt-7.5'
      aria-label={m.common_labels_comments()}
    >
      <header className='mb-5.5'>
        <span className='mb-6 block text-xs leading-[normal] tracking-[normal] text-section-label'>
          {m.blog_comments_discussion_kicker()}
        </span>
        <h2 className='mt-3 text-[clamp(26px,3vw,34px)] leading-normal font-[450] tracking-tighter'>
          {m.blog_comments_conversation()}
          <span className='ml-3.5 inline-flex h-7.75 min-w-7.75 items-center justify-center rounded-full border border-[#9dc9bc40] align-middle text-sm/normal text-[#a4cdbf]'>
            {counts.data ? counts.data.comments + counts.data.replies : '--'}
          </span>
        </h2>
        <p className='mx-0 mt-4.25 mb-5.5 text-base/[1.65] text-[#acc7be]'>{m.blog_comments_discussion_intro()}</p>
      </header>
      <CommentComposer slug={slug} />
      <div className='flex flex-wrap items-center justify-between gap-3 text-sm'>
        <NumberFlowGroup>
          <div>{countsContent}</div>
        </NumberFlowGroup>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button type='button' variant='outline' size='sm' className='min-h-11' />}>
            <ListFilterIcon aria-hidden='true' />
            {m.blog_comments_sort_by()}
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='border border-border shadow-md ring-0'>
            <DropdownMenuRadioGroup
              value={sort}
              onValueChange={(value) => {
                if (value === 'newest' || value === 'oldest') setSort(value === 'newest' ? 'newest' : 'oldest')
              }}
            >
              <DropdownMenuRadioItem value='newest' className='min-h-11'>
                {m.blog_comments_newest()}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='oldest' className='min-h-11'>
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
