import type { GuestbookMessage } from './types'

import { Button, buttonVariants } from '@repo/ui/components/button'
import { createRange } from '@repo/utils'
import { useInfiniteQuery } from '@tanstack/react-query'
import { cn } from 'cn'
import { useEffect, useRef } from 'react'
import { Skeleton } from 'skullet/react'

import { UserAvatar } from '@/components/user-avatar'
import { useFormattedDate } from '@/hooks/use-formatted-date'
import { m } from '@/paraglide/messages'

import { DeleteButton } from './delete-button'
import { guestbookMessagesInfiniteOptions } from './guestbook.queries'

const SAMPLE_MESSAGES: GuestbookMessage[] = createRange(8).map((number) => ({
  id: `guestbook-skeleton-${number}`,
  body: 'A small thought left here, drifting quietly through the ocean.',
  userId: 'guestbook-skeleton',
  user: { id: 'guestbook-skeleton', name: 'Ocean visitor', image: null },
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
}))

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
  const messages = data?.pages.flatMap((page) => page.messages)

  return (
    <div data-testid='guestbook-messages-list' className='flex flex-col gap-5'>
      {(isPending || (messages && messages.length > 0)) && <MessagesList messages={messages} userId={userId} />}
      {isFetchingNextPage && <MessagesList />}
      <span ref={sentinelRef} className='invisible' aria-hidden='true' />
      {hasNextPage && !isFetchingNextPage && !isError && (
        <button
          type='button'
          disabled={isFetching}
          onClick={() => {
            void fetchNextPage()
          }}
          className={cn(buttonVariants({ variant: 'outline', size: 'xl' }))}
        >
          {m.common_load_more()}
        </button>
      )}
      {isError && (
        <div
          role='alert'
          className='space-y-4 rounded-xl border px-6 py-10 text-center text-base/relaxed text-muted-foreground'
        >
          <p>{m.error_failed_to_load_messages()}</p>
          <Button
            type='button'
            variant='outline'
            onClick={() => {
              void refetch()
            }}
          >
            {m.common_retry()}
          </Button>
        </div>
      )}
      {noMessages && (
        <div className='rounded-xl border px-6 py-10 text-center text-base/relaxed text-muted-foreground'>
          <p className='text-sm text-muted-foreground'>{m.guestbook_no_messages()}</p>
        </div>
      )}
    </div>
  )
}

type MessagesListProps = {
  messages?: GuestbookMessage[]
  userId?: string
}

function MessagesList(props: MessagesListProps) {
  const { messages, userId } = props

  return (
    <Skeleton data={messages} sample={SAMPLE_MESSAGES} label={m.common_aria_labels_loading()}>
      {(items) => (
        <div className='flex flex-col gap-5'>
          {items.map((message) => (
            <Message key={message.id} message={message} isAuthor={message.userId === userId} />
          ))}
        </div>
      )}
    </Skeleton>
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
      className='relative rounded-xl border bg-radial-[ellipse_at_0_0] from-primary/5 to-transparent p-6 sm:p-8'
    >
      <span
        aria-hidden='true'
        className='absolute top-9 right-8 size-1.25 rounded-full bg-[#c9e9bb] shadow-[0_0_12px_#a4edb5]'
      />
      <blockquote className='mb-6 pr-5 font-serif text-xl/relaxed wrap-anywhere whitespace-pre-wrap text-primary italic'>
        {message.body}
      </blockquote>
      <div className='flex flex-wrap items-center justify-between gap-4 text-sm/normal text-muted-foreground'>
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
