import type { GuestbookMessage } from './types'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

import { UserAvatar } from '@/components/user-avatar'
import { useFormattedDate } from '@/hooks/use-formatted-date'
import { m } from '@/paraglide/messages'

import { DeleteButton } from './delete-button'
import { guestbookMessagesOptions } from './guestbook.queries'
import { MessagesLoader } from './messages-loader'

type MessagesProps = {
  userId?: string
}

export function Messages(props: MessagesProps) {
  const { userId } = props
  const { data, isSuccess, isPending, isError, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery(guestbookMessagesOptions)
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
    <div className='flex flex-col gap-4'>
      {data?.pages.map((page) =>
        page.messages.map((message) => (
          <Message key={message.id} message={message} isAuthor={message.userId === userId} />
        )),
      )}
      {(isPending || isFetchingNextPage) && <MessagesLoader />}
      <span ref={sentinelRef} className='invisible' />
      {isError && (
        <div className='flex min-h-24 items-center justify-center'>
          <p className='text-sm text-muted-foreground'>{m.error_failed_to_load_messages()}</p>
        </div>
      )}
      {noMessages && (
        <div className='flex min-h-24 items-center justify-center'>
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
    <div className='rounded-xl border p-4'>
      <div className='mb-3 flex gap-3'>
        <UserAvatar id={message.userId} name={message.user.name} image={message.user.image} size='lg' />
        <div className='flex flex-col justify-center gap-px text-sm'>
          <div>{message.user.name}</div>
          <div className='text-xs text-muted-foreground'>{formattedDate ?? '--'}</div>
        </div>
      </div>
      <div className='pl-13 wrap-break-word'>{message.body}</div>
      {isAuthor && <DeleteButton id={message.id} />}
    </div>
  )
}
