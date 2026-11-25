import NumberFlow from '@number-flow/react'
import { ORPCError } from '@orpc/client'
import { toast } from '@repo/ui/components/toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cn } from 'cn'
import { useReducedMotion } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import { PendingCount } from '@/components/pending-count'
import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

export function usePostLike(slug: string) {
  const queryClient = useQueryClient()
  const likesOptions = orpc.posts.likes.queryOptions({ input: { slug } })
  const query = useQuery(likesOptions)

  const [draft, setDraft] = useState(0)
  const [pulse, setPulse] = useState(0)

  const draftRef = useRef(0)

  const reducedMotion = useReducedMotion()

  const save = useMutation(
    orpc.posts.like.mutationOptions({
      onMutate: async ({ value }) => {
        await queryClient.cancelQueries({ queryKey: likesOptions.queryKey })

        const previous = queryClient.getQueryData(likesOptions.queryKey)

        if (previous) {
          queryClient.setQueryData(likesOptions.queryKey, {
            likes: previous.likes + value,
            currentUserLikes: previous.currentUserLikes + value,
          })
        }

        return previous
      },
      onSuccess: (data) => queryClient.setQueryData(likesOptions.queryKey, data),
      onError: (error, _input, previous) => {
        if (previous) {
          queryClient.setQueryData(likesOptions.queryKey, previous)
        }

        toast.add({
          type: 'error',
          title:
            error instanceof ORPCError && error.code === 'BAD_REQUEST'
              ? m.error_like_limit_reached()
              : m.error_something_went_wrong(),
        })
      },
      onSettled: () => {
        void queryClient.invalidateQueries({ queryKey: orpc.posts.key() })
      },
    }),
  )

  const scheduleSave = useDebouncedCallback((value: number) => {
    save.mutate({ slug, value })
    draftRef.current = 0
    setDraft(0)
  }, 1000)

  useEffect(
    () => () => {
      scheduleSave.flush()
    },
    [scheduleSave],
  )

  function like() {
    if (!query.data || save.isPending) return

    if (query.data.currentUserLikes + draftRef.current >= 3) {
      toast.add({ type: 'error', title: m.error_like_limit_reached() })
      return
    }

    draftRef.current += 1
    setDraft(draftRef.current)
    scheduleSave(draftRef.current)

    if (!reducedMotion) setPulse((value) => value + 1)
  }

  return { query, save, draft, pulse, like }
}

type LikeButtonProps = {
  state: ReturnType<typeof usePostLike>
  placement: 'desktop' | 'mobile'
}

export function LikeButton(props: LikeButtonProps) {
  const { state, placement } = props
  const { query, save, draft, pulse, like } = state
  const clipId = useId()
  const count = Math.min(3, (query.data?.currentUserLikes ?? 0) + draft)
  const heart = 'M12 21S2 15.2 2 8.5C2 3.5 8 1.5 12 6c4-4.5 10-2.5 10 2.5C22 15.2 12 21 12 21Z'

  let likesContent: React.ReactNode = (
    <PendingCount>
      <NumberFlow value={100} />
    </PendingCount>
  )

  if (query.data) {
    likesContent = <NumberFlow data-testid='like-count' value={query.data.likes + draft} />
  } else if (query.isLoadingError) {
    likesContent = m.common_error()
  }

  return (
    <div
      className={cn('mt-6', placement === 'desktop' && 'hidden p-2.5 lg:block', placement === 'mobile' && 'lg:hidden')}
    >
      <button
        type='button'
        onClick={() => {
          like()
        }}
        disabled={!query.data || save.isPending}
        aria-disabled={count === 3 || undefined}
        aria-label={m.blog_like_this_post()}
        aria-describedby={`${clipId}-status`}
        className='relative inline-flex min-h-12 items-center justify-center gap-2.5 rounded-md border border-input bg-surface px-4 py-2.5 text-foreground/90 transition-[background-color] ease-linear hover:bg-accent focus-visible:-outline-offset-4 aria-disabled:cursor-default motion-safe:not-aria-disabled:active:scale-97 motion-reduce:transition-none'
      >
        <span className='relative flex text-primary'>
          <svg width='26' height='26' viewBox='0 0 24 24' aria-hidden='true'>
            <defs>
              <clipPath id={clipId}>
                <path d={heart} />
              </clipPath>
            </defs>
            <g clipPath={`url(#${clipId})`}>
              <g
                style={{ transform: `translateY(${[24, 15, 10, 2][count]}px)` }}
                className='transition-transform duration-400 ease-out motion-reduce:transition-none'
              >
                <path
                  key={pulse}
                  d='M-12 0Q-6-2 0 0T12 0T24 0T36 0V30H-12Z'
                  fill='currentColor'
                  className={cn('motion-reduce:animate-none', pulse > 0 && 'animate-like-settle')}
                />
              </g>
            </g>
            <path d={heart} fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinejoin='round' />
          </svg>
          {pulse > 0 && (
            <span key={pulse} aria-hidden='true' className='pointer-events-none absolute inset-0 motion-reduce:hidden'>
              <i className='absolute top-1.75 left-0.75 size-1 animate-like-bubble rounded-full border border-primary opacity-0' />
              <i className='absolute top-0.75 left-3.25 size-1 animate-like-bubble rounded-full border border-primary opacity-0 delay-50' />
              <i className='absolute top-2.25 left-5.5 size-1 animate-like-bubble rounded-full border border-primary opacity-0 delay-100' />
              {count === 3 && (
                <b className='absolute -inset-1 animate-like-ripple rounded-full border border-primary' />
              )}
            </span>
          )}
        </span>
        <span>{count === 3 ? m.blog_liked() : m.common_like()}</span>
        <span className='border-l border-l-border pl-2.5 text-muted-foreground tabular-nums'>{likesContent}</span>
      </button>
      <output id={`${clipId}-status`} className='sr-only'>
        {count} / 3
      </output>
    </div>
  )
}
