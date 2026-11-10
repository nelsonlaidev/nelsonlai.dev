import type { Comment } from './types'

import NumberFlow from '@number-flow/react'
import { Badge } from '@repo/ui/components/badge'
import { Button } from '@repo/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu'
import { toast } from '@repo/ui/components/toast'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ChevronDownIcon,
  CopyIcon,
  MessageSquareIcon,
  MoreVerticalIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  TrashIcon,
} from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Skeleton } from 'skullet/react'

import { Markdown } from '@/components/mdx/markdown'
import { UserAvatar } from '@/components/user-avatar'
import { useFormattedDate } from '@/hooks/use-formatted-date'
import { authClient } from '@/lib/auth-client'
import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

import { CommentComposer } from './comment-composer'
import { commentListInfiniteOptions } from './comments.queries'
import { DeleteComment } from './delete-comment'

const SAMPLE_COMMENT: Comment = {
  id: 'sample-comment',
  userId: 'sample',
  user: { id: 'sample', name: 'Ocean visitor', image: '/images/avatar.png', role: 'user' },
  postId: 'sample-post',
  parentId: null,
  body: 'Thanks for sharing the details of this project.',
  createdAt: new Date('2026-01-01T12:00:00Z'),
  isDeleted: false,
  likeCount: 0,
  dislikeCount: 0,
  replyCount: 0,
  liked: null,
}

type CommentListProps = {
  slug: string
  sort: 'newest' | 'oldest'
  parentId?: string
  highlightedCommentId?: string
  highlightedReplyId?: string
}

export function CommentList(props: CommentListProps) {
  const { slug, sort, parentId, highlightedCommentId, highlightedReplyId } = props
  const session = authClient.useSession()
  const options = commentListInfiniteOptions(
    {
      slug,
      sort,
      parentId,
      highlightedCommentId: parentId ? highlightedReplyId : highlightedCommentId,
    },
    session.data?.user.id,
  )
  const query = useInfiniteQuery({
    ...options,
    enabled: !session.isPending,
  })
  const sentinelRef = useRef<HTMLSpanElement>(null)
  const { hasNextPage, isFetching, isError, fetchNextPage } = query

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasNextPage || isFetching || isError) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) void fetchNextPage()
    })
    observer.observe(sentinel)
    return () => {
      observer.disconnect()
    }
  }, [hasNextPage, isFetching, isError, fetchNextPage])

  return (
    <div className='space-y-8 py-2'>
      {query.data?.pages
        .flatMap((page) => page.comments)
        .map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            slug={slug}
            highlightedCommentId={highlightedCommentId}
            highlightedReplyId={highlightedReplyId}
          />
        ))}
      {(query.isPending || query.isFetchingNextPage) && (
        <>
          <output className='sr-only'>{m.common_aria_labels_loading()}</output>
          <Skeleton loading>
            <CommentItem comment={parentId ? { ...SAMPLE_COMMENT, parentId } : SAMPLE_COMMENT} slug={slug} />
          </Skeleton>
        </>
      )}
      {query.isError && (
        <p role='alert' className='py-6 text-center text-sm text-muted-foreground'>
          {parentId ? m.error_failed_to_load_replies() : m.error_failed_to_load_comments()}
        </p>
      )}
      {query.isSuccess && query.data.pages.every((page) => page.comments.length === 0) && (
        <p className='py-6 text-center text-sm text-muted-foreground'>{m.blog_comments_no_comments()}</p>
      )}
      <span ref={sentinelRef} className='invisible' />
      {query.hasNextPage && (
        <Button
          type='button'
          variant='outline'
          disabled={query.isFetching}
          onClick={() => {
            void query.fetchNextPage()
          }}
        >
          {m.common_load_more()}
        </Button>
      )}
    </div>
  )
}

type CommentItemProps = Omit<CommentListProps, 'sort' | 'parentId'> & {
  comment: Comment
}

function CommentItem(props: CommentItemProps) {
  const { comment, slug, highlightedCommentId, highlightedReplyId } = props
  const [replying, setReplying] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [repliesOpen, setRepliesOpen] = useState(comment.id === highlightedCommentId)
  const session = authClient.useSession()
  const queryClient = useQueryClient()
  const formattedDate = useFormattedDate(comment.createdAt, { relative: true })
  const fullDate = useFormattedDate(comment.createdAt, { formatName: 'long' })
  const highlighted = comment.id === (highlightedReplyId ?? highlightedCommentId)
  const elementRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const [optimisticVote, setOptimisticVote] = useState<boolean | null | undefined>()
  const liked = optimisticVote === undefined ? comment.liked : optimisticVote
  const likeCount = comment.likeCount + Number(liked === true) - Number(comment.liked === true)
  const dislikeCount = comment.dislikeCount + Number(liked === false) - Number(comment.liked === false)
  const vote = useMutation(
    orpc.comments.vote.mutationOptions({
      onMutate: (input) => {
        setOptimisticVote(input.isLike)
      },
      onError: () => {
        setOptimisticVote(undefined)
        toast.add({ type: 'error', title: m.error_something_went_wrong() })
      },
      onSettled: async () => {
        await queryClient.invalidateQueries({ queryKey: orpc.comments.list.key() })
        setOptimisticVote(undefined)
      },
    }),
  )

  useEffect(() => {
    if (highlighted)
      elementRef.current?.scrollIntoView({ block: 'center', behavior: reducedMotion ? 'instant' : 'smooth' })
  }, [highlighted, reducedMotion])

  function castVote(isLike: boolean) {
    if (!session.data) {
      toast.add({ type: 'error', title: m.error_need_logged_in_to_vote() })
      return
    }
    if (!vote.isPending) vote.mutate({ id: comment.id, isLike: comment.liked === isLike ? null : isLike })
  }

  async function copyLink() {
    const url = new URL(globalThis.location.href)
    url.hash = ''
    url.search = ''
    url.searchParams.set('comment', comment.parentId ?? comment.id)
    if (comment.parentId) url.searchParams.set('reply', comment.id)
    try {
      await navigator.clipboard.writeText(url.href)
      toast.add({ type: 'success', title: m.success_link_copied() })
    } catch {
      toast.add({ type: 'error', title: m.error_copy_to_clipboard_error() })
    }
  }

  return (
    <>
      <div data-testid={`comment-${comment.id}`} ref={elementRef} className='scroll-m-32 p-2.5'>
        {highlighted && <Badge className='mb-4'>{m.blog_comments_highlighted_comment()}</Badge>}
        <div className='flex gap-4'>
          <UserAvatar id={comment.user.id} name={comment.user.name} image={comment.user.image} />
          <div className='min-w-0 flex-1'>
            <div className='ml-0.5 flex min-h-8 flex-wrap items-center justify-between gap-2 text-sm'>
              <div className='flex min-w-0 flex-wrap items-center gap-2'>
                <span className='max-w-40 truncate font-semibold'>{comment.user.name}</span>
                <Tooltip>
                  <TooltipTrigger
                    render={<time dateTime={comment.createdAt.toISOString()} />}
                    className='text-xs text-muted-foreground'
                  >
                    {formattedDate ?? '--'}
                  </TooltipTrigger>
                  <TooltipContent>{fullDate ?? '--'}</TooltipContent>
                </Tooltip>
                {comment.user.role === 'admin' && (
                  <div className='rounded-md border border-red-500/50 bg-red-900/50 px-2 py-0.5 text-sm'>
                    {m.blog_comments_author()}
                  </div>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button type='button' variant='ghost' size='icon-sm' />}
                  aria-label={m.blog_comments_open_menu()}
                >
                  <MoreVerticalIcon aria-hidden='true' />
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='min-w-36 border shadow-md ring-0'>
                  <DropdownMenuItem
                    onClick={() => {
                      void copyLink()
                    }}
                  >
                    <CopyIcon aria-hidden='true' /> {m.blog_comments_copy_link()}
                  </DropdownMenuItem>
                  {!comment.isDeleted && session.data?.user.id === comment.userId && (
                    <DropdownMenuItem
                      variant='destructive'
                      onClick={() => {
                        setDeleteOpen(true)
                      }}
                    >
                      <TrashIcon aria-hidden='true' /> {m.common_delete()}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              {!comment.isDeleted && session.data?.user.id === comment.userId && (
                <DeleteComment id={comment.id} open={deleteOpen} onOpenChange={setDeleteOpen} />
              )}
            </div>
            {comment.isDeleted ? (
              <p className='text-sm text-muted-foreground'>{m.blog_comments_this_comment_has_been_deleted()}</p>
            ) : (
              <Markdown>{comment.body}</Markdown>
            )}
            {!comment.isDeleted && !replying && (
              <div className='flex gap-1'>
                <Button
                  type='button'
                  variant='secondary'
                  size='sm'
                  className='font-mono text-xs text-muted-foreground aria-pressed:bg-accent aria-pressed:text-accent-foreground'
                  aria-label={m.common_like()}
                  aria-pressed={liked === true}
                  disabled={vote.isPending}
                  onClick={() => {
                    castVote(true)
                  }}
                >
                  <ThumbsUpIcon aria-hidden='true' />
                  <NumberFlow value={likeCount} />
                </Button>
                <Button
                  type='button'
                  variant='secondary'
                  size='sm'
                  className='font-mono text-xs text-muted-foreground aria-pressed:bg-accent aria-pressed:text-accent-foreground'
                  aria-label={m.blog_comments_dislike()}
                  aria-pressed={liked === false}
                  disabled={vote.isPending}
                  onClick={() => {
                    castVote(false)
                  }}
                >
                  <ThumbsDownIcon aria-hidden='true' />
                  <NumberFlow value={dislikeCount} />
                </Button>
                {!comment.parentId && (
                  <Button
                    type='button'
                    variant='secondary'
                    size='sm'
                    className='text-xs text-muted-foreground'
                    onClick={() => {
                      setReplying(true)
                    }}
                  >
                    <MessageSquareIcon aria-hidden='true' />
                    {m.blog_comments_reply()}
                  </Button>
                )}
              </div>
            )}
            {replying && (
              <CommentComposer
                slug={slug}
                parentId={comment.id}
                onCancel={() => {
                  setReplying(false)
                }}
              />
            )}
            {!comment.parentId && comment.replyCount > 0 && (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                aria-expanded={repliesOpen}
                className='mt-4 text-xs aria-expanded:[&>svg]:rotate-180'
                onClick={() => {
                  setRepliesOpen(!repliesOpen)
                }}
              >
                <ChevronDownIcon
                  aria-hidden='true'
                  className='size-4 transition-transform duration-200 motion-reduce:transition-none'
                />
                <NumberFlow data-testid='comment-reply-count' value={comment.replyCount} />
                {m.blog_comments_replies({ count: comment.replyCount })}
              </Button>
            )}
          </div>
        </div>
      </div>
      {!comment.parentId && repliesOpen && comment.replyCount > 0 && (
        <div className='pl-7'>
          <CommentList
            slug={slug}
            parentId={comment.id}
            sort='oldest'
            highlightedCommentId={highlightedCommentId}
            highlightedReplyId={highlightedReplyId}
          />
        </div>
      )}
    </>
  )
}
