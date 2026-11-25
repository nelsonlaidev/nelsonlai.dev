import { ORPCError } from '@orpc/client'
import { Button } from '@repo/ui/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card'
import { Spinner } from '@repo/ui/components/spinner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BellOffIcon } from 'lucide-react'
import { Skeleton } from 'skullet/react'

import { OceanPage } from '@/components/ocean-page'
import { QueryErrorMessage } from '@/components/query-error-message'
import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

type UnsubscribeFormProps = {
  token?: string
}

export function UnsubscribeForm(props: UnsubscribeFormProps) {
  const { token } = props
  const queryClient = useQueryClient()
  const options = orpc.notifications.inspectUnsubscribe.queryOptions({
    input: { token: token ?? '' },
    enabled: Boolean(token),
    retry: false,
  })
  const query = useQuery(options)
  const unsubscribe = useMutation(
    orpc.notifications.unsubscribeFromCommentReplies.mutationOptions({
      onSuccess: (_data, input) => {
        const queryKey = orpc.notifications.inspectUnsubscribe.queryKey({ input })
        queryClient.setQueryData(queryKey, (previous) => (previous ? { ...previous, isUnsubscribed: true } : previous))
      },
    }),
  )

  const { data } = query
  const isInvalid =
    !token ||
    (query.error instanceof ORPCError && (query.error.code === 'BAD_REQUEST' || query.error.code === 'NOT_FOUND'))
  const isLoading = Boolean(token) && query.isPending
  const isSubmitting = unsubscribe.isPending

  let title = m.unsubscribe_unsubscribe_from_this_comment()
  let description = m.unsubscribe_stop_receiving_email_notifications()
  let content: React.ReactNode

  if (isInvalid) {
    title = m.unsubscribe_invalid_unsubscribe_link()
    description = m.unsubscribe_invalid_link_description()
    content = null
  } else if (query.isLoadingError) {
    content = (
      <CardContent className='px-0'>
        <QueryErrorMessage
          role='alert'
          query={query}
          message={m.error_something_went_wrong()}
          className='justify-center'
        />
      </CardContent>
    )
  } else if (data?.isUnsubscribed) {
    title = m.unsubscribe_you_have_been_unsubscribed()
    description = m.unsubscribe_unsubscribed_description()
    content = null
  } else {
    content = (
      <CardContent className='mt-4 gap-6 px-0'>
        <div className='space-y-2'>
          <p>{m.common_labels_comment()}</p>
          <blockquote className='rounded-sm border bg-input/30 p-3 text-sm/relaxed text-pretty wrap-break-word whitespace-pre-wrap text-foreground/90'>
            {data?.comment ?? 'A comment from a reader.'}
          </blockquote>
        </div>
        <div className='space-y-3'>
          <Button
            disabled={!data || isSubmitting}
            className='w-full'
            onClick={() => {
              if (token && data && !isSubmitting) unsubscribe.mutate({ token })
            }}
          >
            {isSubmitting && <Spinner data-icon='inline-start' />}
            {m.common_labels_unsubscribe()}
          </Button>
          <p className='text-center text-xs text-balance text-muted-foreground'>
            {m.unsubscribe_you_are_unsubscribing_as({ email: data?.userEmail ?? 'reader@example.com' })}
          </p>
        </div>
      </CardContent>
    )
  }

  return (
    <OceanPage className='grid content-center pt-28 wrap-anywhere sm:pt-32 lg:pt-36'>
      <Skeleton loading={isLoading} label={m.common_aria_labels_loading()}>
        <Card className='mx-auto w-full max-w-160 rounded-xl bg-surface p-6 sm:p-8' aria-busy={isSubmitting}>
          <CardHeader className='gap-4 px-0 text-center'>
            <div className='mx-auto flex size-16 items-center justify-center rounded-full bg-accent'>
              <BellOffIcon className='size-8' aria-hidden='true' />
            </div>
            <div className='space-y-2' aria-live='polite'>
              <CardTitle className='text-2xl text-balance'>
                <h1 className='text-3xl font-normal tracking-tight text-foreground sm:text-4xl'>{title}</h1>
              </CardTitle>
              {description && (
                <CardDescription className='text-base text-pretty text-muted-foreground'>{description}</CardDescription>
              )}
            </div>
          </CardHeader>
          {content}
          {unsubscribe.isError && (
            <CardContent className='px-0'>
              <p role='alert'>{m.error_something_went_wrong()}</p>
            </CardContent>
          )}
        </Card>
      </Skeleton>
    </OceanPage>
  )
}
