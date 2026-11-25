import type { Comment } from './types'

import NumberFlow from '@number-flow/react'
import { authClient } from '@repo/auth/client'
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
import { createRange } from '@repo/utils'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cn } from 'cn'
import {
  ChevronRightIcon,
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

import { InfiniteQueryPagination } from '@/components/infinite-query-pagination'
import { LoadingStatus } from '@/components/loading-status'
import { UserAvatar } from '@/components/user-avatar'
import { useFormattedDate } from '@/hooks/use-formatted-date'
import { getMutationErrorMessage } from '@/lib/get-mutation-error-message'
import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

import { CommentComposer } from './comment-composer'
import { CommentMarkdown } from './comment-markdown'
import { commentListInfiniteOptions } from './comments.queries'
import { DeleteComment } from './delete-comment'

const SAMPLE_COMMENTS: Comment[] = createRange(5).map((number) => ({
  id: `comment-skeleton-${number}`,
  userId: 'sample',
  user: { id: 'sample', name: 'Ocean visitor', image: '/images/avatar.png', role: 'user' },
  postSlug: 'sample-post',
  parentId: null,
  body: 'Thanks for sharing the details of this project.',
  createdAt: new Date('2026-01-01T12:00:00Z'),
  isDeleted: false,
  likeCount: 0,
  dislikeCount: 0,
  replyCount: 0,
  liked: null,
}))

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
  return (
    <div className={parentId ? 'space-y-5 pt-2' : 'space-y-8 py-2'}>
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
          <LoadingStatus />
          <Skeleton loading>
            <div className={parentId ? 'space-y-5' : 'space-y-8'}>
              {SAMPLE_COMMENTS.map((comment) => (
                <CommentItem key={comment.id} comment={parentId ? { ...comment, parentId } : comment} slug={slug} />
              ))}
            </div>
          </Skeleton>
        </>
      )}
      {query.isSuccess && query.data.pages.every((page) => page.comments.length === 0) && (
        <p className='py-6 text-center text-sm text-muted-foreground'>{m.blog_comments_no_comments()}</p>
      )}
      <InfiniteQueryPagination
        query={query}
        errorMessage={parentId ? m.error_failed_to_load_replies() : m.error_failed_to_load_comments()}
        errorClassName='space-y-4 py-6 text-center text-sm text-muted-foreground'
      />
    </div>
  )
}

type CommentItemProps = Omit<CommentListProps, 'sort' | 'parentId'> & {
  comment: Comment
}

function CommentItem(props: CommentItemProps) {
  const { comment, slug, highlightedCommentId, highlightedReplyId } = props
  const userName = comment.user?.name ?? m.common_labels_deleted_user()
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
  const mutation = useMutation(
    orpc.comments.vote.mutationOptions({
      onMutate: (input) => {
        setOptimisticVote(input.isLike)
      },
      onError: (error) => {
        setOptimisticVote(undefined)
        toast.add({ type: 'error', title: getMutationErrorMessage(error, m.error_something_went_wrong()) })
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
    if (!mutation.isPending) {
      mutation.mutate({ id: comment.id, isLike: comment.liked === isLike ? null : isLike })
    }
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
    <div ref={elementRef} className='scroll-m-32'>
      {highlighted && (
        <Badge data-testid={`highlighted-comment-${comment.id}`} className='mb-4'>
          {m.blog_comments_highlighted_comment()}
        </Badge>
      )}
      <div data-testid={`comment-${comment.id}`} className='flex gap-3 sm:gap-4'>
        <UserAvatar id={comment.user?.id} name={userName} image={comment.user?.image} />
        <div className='min-w-0 flex-1'>
          <div className='ml-0.5 flex min-h-8 flex-wrap items-center justify-between gap-2 text-sm'>
            <div className='flex min-w-0 flex-wrap items-center gap-2'>
              <span className='max-w-40 truncate font-semibold'>{userName}</span>
              <Tooltip>
                <TooltipTrigger
                  render={<time dateTime={comment.createdAt.toISOString()} />}
                  className='text-xs text-muted-foreground'
                >
                  {formattedDate ?? '--'}
                </TooltipTrigger>
                <TooltipContent>{fullDate ?? '--'}</TooltipContent>
              </Tooltip>
              {comment.user?.role === 'admin' && <Badge>{m.blog_comments_author()}</Badge>}
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
            <p className='mt-1 text-sm text-muted-foreground'>{m.blog_comments_this_comment_has_been_deleted()}</p>
          ) : (
            <CommentMarkdown className='mt-1 py-0'>{comment.body}</CommentMarkdown>
          )}
          {!comment.isDeleted && !replying && (
            <div className='mt-2.5 flex gap-1'>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='font-mono text-xs text-muted-foreground aria-pressed:bg-accent aria-pressed:text-accent-foreground'
                aria-label={m.common_like()}
                aria-pressed={liked === true}
                skullet-block=''
                aria-busy={mutation.isPending}
                disabled={mutation.isPending}
                onClick={() => {
                  castVote(true)
                }}
              >
                <ThumbsUpIcon aria-hidden='true' data-icon='inline-start' />
                <NumberFlow value={likeCount} />
              </Button>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='font-mono text-xs text-muted-foreground aria-pressed:bg-accent aria-pressed:text-accent-foreground'
                aria-label={m.blog_comments_dislike()}
                aria-pressed={liked === false}
                skullet-block=''
                aria-busy={mutation.isPending}
                disabled={mutation.isPending}
                onClick={() => {
                  castVote(false)
                }}
              >
                <ThumbsDownIcon aria-hidden='true' data-icon='inline-start' />
                <NumberFlow value={dislikeCount} />
              </Button>
              {!comment.parentId && (
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='text-xs text-muted-foreground'
                  onClick={() => {
                    setReplying(true)
                  }}
                >
                  <MessageSquareIcon aria-hidden='true' data-icon='inline-start' />
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
              className={cn('text-xs aria-expanded:[&>svg]:rotate-90', comment.isDeleted ? 'mt-2.5' : 'mt-1')}
              onClick={() => {
                setRepliesOpen(!repliesOpen)
              }}
            >
              <ChevronRightIcon
                data-icon='inline-start'
                aria-hidden='true'
                className='transition-transform duration-200 motion-reduce:transition-none'
              />
              <span data-testid='comment-reply-count'>
                {repliesOpen
                  ? m.blog_comments_hide_replies()
                  : m.blog_comments_show_replies({ count: comment.replyCount })}
              </span>
            </Button>
          )}
        </div>
      </div>
      {!comment.parentId && repliesOpen && comment.replyCount > 0 && (
        <div className='relative mt-3 ml-4 pl-3 before:absolute before:inset-y-0 before:left-0 before:w-px before:-translate-x-1/2 before:bg-border/60 sm:pl-5'>
          <CommentList
            slug={slug}
            parentId={comment.id}
            sort='oldest'
            highlightedCommentId={highlightedCommentId}
            highlightedReplyId={highlightedReplyId}
          />
        </div>
      )}
    </div>
  )
}
