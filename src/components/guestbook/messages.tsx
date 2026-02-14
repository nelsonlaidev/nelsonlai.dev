'use client'

import type { MessageListOutput } from '@/orpc/client'

import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useListMessages } from '@/hooks/queries/message.query'
import { useFormattedDate } from '@/hooks/use-formatted-date'
import { useSession } from '@/lib/auth-client'
import { getAbbreviation } from '@/utils/get-abbreviation'
import { getDefaultImage } from '@/utils/get-default-image'

import DeleteButton from './delete-button'
import MessagesLoader from './messages-loader'

function Messages() {
  const { data, isSuccess, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useListMessages()
  const t = useTranslations()

  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage) void fetchNextPage()
  }, [fetchNextPage, hasNextPage, inView])

  const noMessages = isSuccess && data.pages.every((page) => page.messages.length === 0)

  return (
    <div className='flex flex-col gap-4' data-testid='guestbook-messages-list'>
      {isSuccess &&
        data.pages.map((page) => page.messages.map((message) => <Message key={message.id} message={message} />))}
      {(isLoading || isFetchingNextPage) && <MessagesLoader />}
      <span ref={ref} className='invisible' />
      {isError && (
        <div className='flex min-h-24 items-center justify-center'>
          <p className='text-sm text-muted-foreground'>{t('error.failed-to-load-messages')}</p>
        </div>
      )}
      {noMessages && (
        <div className='flex min-h-24 items-center justify-center'>
          <p className='text-sm text-muted-foreground'>{t('guestbook.no-messages')}</p>
        </div>
      )}
    </div>
  )
}

type MessageProps = {
  message: MessageListOutput['messages'][number]
}

function Message(props: MessageProps) {
  const { message } = props
  const { data: session } = useSession()

  const isAuthor = message.userId === session?.user.id

  const defaultImage = getDefaultImage(message.userId)

  const formattedDate = useFormattedDate(message.createdAt, { formatName: 'long' })

  return (
    <div className='rounded-xl border p-4' data-testid={`message-${message.id}`}>
      <div className='mb-3 flex gap-3'>
        <Avatar className='size-10'>
          <AvatarImage src={message.user.image ?? defaultImage} alt={message.user.name} />
          <AvatarFallback>{getAbbreviation(message.user.name)}</AvatarFallback>
        </Avatar>
        <div className='flex flex-col justify-center gap-px text-sm'>
          <div>{message.user.name}</div>
          <div className='text-xs text-muted-foreground'>{formattedDate ?? '--'}</div>
        </div>
      </div>
      <div className='pl-13 wrap-break-word'>{message.body}</div>
      {isAuthor && <DeleteButton message={message} />}
    </div>
  )
}

export default Messages
