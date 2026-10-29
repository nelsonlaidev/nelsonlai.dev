import NumberFlow from '@number-flow/react'
import { ORPCError } from '@orpc/client'
import { Separator } from '@repo/ui/components/separator'
import { toast } from '@repo/ui/components/toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

type LikeButtonProps = {
  slug: string
}

export function LikeButton(props: LikeButtonProps) {
  const { slug } = props
  const queryClient = useQueryClient()
  const likesOptions = orpc.posts.likes.queryOptions({ input: { slug } })
  const query = useQuery(likesOptions)

  const [draft, setDraft] = useState(0)
  const clipId = useId()

  const draftRef = useRef(0)
  const buttonRef = useRef<HTMLButtonElement>(null)

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

  async function like() {
    if (!query.data || save.isPending) return

    if (query.data.currentUserLikes + draftRef.current >= 3) {
      toast.add({ type: 'error', title: m.error_like_limit_reached() })
      return
    }

    draftRef.current += 1
    setDraft(draftRef.current)
    scheduleSave(draftRef.current)

    if (!reducedMotion && query.data.currentUserLikes + draftRef.current === 3) {
      const box = buttonRef.current?.getBoundingClientRect()

      if (box) {
        const { default: confetti } = await import('canvas-confetti')

        void confetti({
          particleCount: 100,
          spread: 100,
          zIndex: 999,
          shapes: [confetti.shapeFromText({ text: '❤️', scalar: 2 })],
          origin: { x: (box.x + box.width / 2) / innerWidth, y: box.y / innerHeight },
          disableForReducedMotion: true,
        })
      }
    }
  }

  let likesContent: React.ReactNode = '--'

  if (query.data) {
    likesContent = <NumberFlow data-testid='like-count' value={query.data.likes + draft} />
  } else if (query.isError) {
    likesContent = m.common_error()
  }

  return (
    <div className='mt-12 mb-4 flex justify-center'>
      <motion.button
        ref={buttonRef}
        type='button'
        tabIndex={0}
        onClick={() => {
          void like()
        }}
        disabled={!query.data || save.isPending}
        whileTap={reducedMotion ? undefined : { scale: 0.96 }}
        aria-label={m.blog_like_this_post()}
        className='flex items-center gap-3 rounded-4xl bg-primary px-4 py-2 text-lg text-primary-foreground disabled:opacity-60 dark:bg-primary/5 dark:text-foreground'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='28'
          height='28'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='size-7 text-red-500'
          aria-hidden='true'
        >
          <defs>
            <clipPath id={clipId}>
              <path d='M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572' />
            </clipPath>
          </defs>
          <path d='M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572' />
          <g clipPath={`url(#${clipId})`}>
            <motion.rect
              x='0'
              y='0'
              width='24'
              height='24'
              fill='currentColor'
              stroke='none'
              initial={reducedMotion ? false : { y: 24 }}
              animate={{ y: 24 - ((query.data?.currentUserLikes ?? 0) + draft) * 8 }}
              transition={{ duration: reducedMotion ? 0 : 0.3 }}
            />
          </g>
        </svg>
        {m.common_like()}
        <Separator orientation='vertical' className='h-5 bg-current/20 data-vertical:self-center' />
        {likesContent}
      </motion.button>
    </div>
  )
}
