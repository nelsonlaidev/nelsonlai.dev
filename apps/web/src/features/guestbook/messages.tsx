import type { GuestbookMessage } from './types'

import { outlineActionVariants } from '@repo/ui/components/button'
import { useInfiniteQuery } from '@tanstack/react-query'
import { cn } from 'cn'
import { useEffect, useRef } from 'react'

import { UserAvatar } from '@/components/user-avatar'
import { useFormattedDate } from '@/hooks/use-formatted-date'
import { m } from '@/paraglide/messages'

import { DeleteButton } from './delete-button'
import { guestbookMessagesInfiniteOptions } from './guestbook.queries'
import { MessagesLoader } from './messages-loader'

type MessagesProps = {
  userId?: string
}

export function Messages(props: MessagesProps) {
  const { userId } = props
  const { data, isSuccess, isPending, isError, fetchNextPage, refetch, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery(guestbookMessagesInfiniteOptions)
  const sentinelRef = useRef<HTMLSpanElement>(null)

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
  }, [fetchNextPage, hasNextPage, isFetching, isError])

  const noMessages = isSuccess && data.pages.every((page) => page.messages.length === 0)

  return (
    <div data-testid='guestbook-messages-list' className='mt-6.25 flex flex-col gap-5'>
      {data?.pages.map((page) =>
        page.messages.map((message) => (
          <Message key={message.id} message={message} isAuthor={message.userId === userId} />
        )),
      )}
      {(isPending || isFetchingNextPage) && (
        <output aria-label={m.common_aria_labels_loading()}>
          <MessagesLoader />
        </output>
      )}
      <span ref={sentinelRef} className='invisible' aria-hidden='true' />
      {hasNextPage && !isFetchingNextPage && !isError && (
        <button
          type='button'
          disabled={isFetching}
          onClick={() => {
            void fetchNextPage()
          }}
          className={cn(
            outlineActionVariants(),
            'inline-flex h-auto min-h-12 cursor-pointer items-center justify-center gap-7 rounded-md border px-5.75 py-3.5 text-sm/normal transition-colors duration-200 ease-linear disabled:cursor-wait disabled:opacity-[0.5] motion-reduce:transition-none',
          )}
        >
          {m.common_load_more()}
        </button>
      )}
      {isError && (
        <div role='alert' className='border border-[#a3d1b528] px-6 py-10 text-center text-base/[1.65] text-[#adcab0]'>
          <p>{m.error_failed_to_load_messages()}</p>
          <button
            type='button'
            className={cn(
              outlineActionVariants(),
              'mt-4 inline-flex h-auto min-h-12 cursor-pointer items-center justify-center gap-7 rounded-md border px-5.75 py-3.5 text-sm/normal transition-colors duration-200 ease-linear disabled:cursor-wait disabled:opacity-[0.5] motion-reduce:transition-none',
            )}
            onClick={() => {
              void refetch()
            }}
          >
            {m.common_retry()}
          </button>
        </div>
      )}
      {noMessages && (
        <div className='border border-[#a3d1b528] px-6 py-10 text-center text-base/[1.65] text-[#adcab0]'>
          <p className='text-sm text-muted-foreground'>{m.guestbook_no_messages()}</p>
        </div>
      )}
    </div>
  )
}

type MessageProps = {
  message: GuestbookMessage
  isAuthor: boolean
}

function Message(props: MessageProps) {
  const { message, isAuthor } = props
  const formattedDate = useFormattedDate(message.createdAt, { formatName: 'long' })

  return (
    <article
      data-testid={`message-${message.id}`}
      className='relative border border-[#a3d1b528] p-7.5 [background:radial-gradient(ellipse_at_0_0,#89ccaa10,transparent)] max-[601px]:p-6.25'
    >
      <span
        aria-hidden='true'
        className='absolute top-9 right-7.5 size-1.25 rounded-full bg-[#c9e9bb] shadow-[0_0_12px_#a4edb5]'
      />
      <span className='block pr-5 text-xs leading-[normal] tracking-[0.02em] text-[#a8c9b2]'>{m.seabed_light()}</span>
      <blockquote className='mx-0 my-6.25 font-serif text-[22px] leading-[1.65] wrap-anywhere whitespace-pre-wrap text-[#d3e3cb] italic max-[601px]:text-[21px]'>
        {message.body}
      </blockquote>
      <div className='flex flex-wrap items-center justify-between gap-3.75 text-sm/normal text-[#adcab0]'>
        <span className='flex min-w-0 items-center gap-3'>
          <UserAvatar id={message.userId} name={message.user.name} image={message.user.image} />
          <span className='min-w-0 wrap-anywhere'>{message.user.name}</span>
        </span>
        <time dateTime={message.createdAt.toISOString()}>{formattedDate ?? '--'}</time>
      </div>
      {isAuthor && <DeleteButton id={message.id} />}
    </article>
  )
}
