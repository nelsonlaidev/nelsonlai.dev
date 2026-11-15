import { Button } from '@repo/ui/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card'
import { Spinner } from '@repo/ui/components/spinner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { BellOffIcon } from 'lucide-react'
import { Skeleton } from 'skullet/react'

import { MainLayout } from '@/components/main-layout'
import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

type UnsubscribePageProps = {
  token?: string
}

export function UnsubscribePage(props: UnsubscribePageProps) {
  const { token } = props
  const queryClient = useQueryClient()
  const options = orpc.notifications.inspectUnsubscribe.queryOptions({
    input: { token: token ?? '' },
    enabled: Boolean(token),
    retry: false,
  })
  const query = useQuery(options)
  const unsubscribe = useMutation(
    orpc.notifications.unsubscribe.mutationOptions({
      onSuccess: (_data, input) => {
        const queryKey = orpc.notifications.inspectUnsubscribe.queryKey({ input })
        queryClient.setQueryData(queryKey, (previous) => (previous ? { ...previous, isUnsubscribed: true } : previous))
      },
    }),
  )

  const isInvalid = !token || query.isError
  let title = m.unsubscribe_unsubscribe_from_this_comment()
  let description = m.unsubscribe_stop_receiving_email_notifications()
  let content: React.ReactNode

  if (isInvalid) {
    title = m.unsubscribe_invalid_unsubscribe_link()
    description = m.unsubscribe_invalid_link_description()
    content = null
  } else if (query.data?.isUnsubscribed) {
    title = m.unsubscribe_you_have_been_unsubscribed()
    description = m.unsubscribe_unsubscribed_description()
    content = null
  } else {
    content = (
      <CardContent className='space-y-8'>
        <div className='space-y-2'>
          <p>{m.common_labels_comment()}</p>
          <blockquote className='rounded-none border bg-input/30 p-3 text-sm/relaxed text-pretty wrap-break-word whitespace-pre-wrap text-foreground/90'>
            {query.data?.comment ?? 'A comment from a reader.'}
          </blockquote>
        </div>
        <div className='space-y-3'>
          <Button
            disabled={!query.data || unsubscribe.isPending}
            className='w-full'
            onClick={() => {
              if (query.data && !unsubscribe.isPending) unsubscribe.mutate({ token })
            }}
          >
            {unsubscribe.isPending && <Spinner />}
            {m.common_labels_unsubscribe()}
          </Button>
          <p className='text-center text-xs text-balance text-muted-foreground'>
            {m.unsubscribe_you_are_unsubscribing_as({ email: query.data?.userEmail ?? 'reader@example.com' })}
          </p>
        </div>
      </CardContent>
    )
  }

  return (
    <MainLayout>
      <div className='relative mx-4 pt-32 pb-16 wrap-anywhere subpixel-antialiased sm:mx-auto sm:w-[min(84%,640px)] sm:pt-40'>
        <Skeleton loading={Boolean(token) && query.isPending} label={m.common_aria_labels_loading()}>
          <Card
            className='w-full max-w-none rounded-xl bg-surface p-6 md:p-8 lg:p-10 xl:p-12'
            aria-busy={unsubscribe.isPending}
          >
            <CardHeader className='space-y-4 px-0 text-center'>
              <div className='mx-auto flex size-16 items-center justify-center rounded-full bg-accent'>
                <BellOffIcon className='size-8' aria-hidden='true' />
              </div>
              <div className={isInvalid ? 'space-y-4' : 'space-y-2'} aria-live='polite'>
                <CardTitle className='text-2xl text-balance'>
                  <h1 className='text-3xl font-normal tracking-tighter text-foreground sm:text-4xl'>{title}</h1>
                </CardTitle>
                {description && (
                  <CardDescription className='mt-6 text-base/relaxed text-pretty text-muted-foreground'>
                    {description}
                  </CardDescription>
                )}
              </div>
            </CardHeader>
            {content}
            {unsubscribe.isError && (
              <CardContent role='alert' className='px-0'>
                {m.error_something_went_wrong()}
              </CardContent>
            )}
          </Card>
        </Skeleton>
        <Link to='/' className='mt-6 inline-flex items-center gap-4 text-sm/normal text-link'>
          {m.common_go_to_homepage()}
        </Link>
      </div>
    </MainLayout>
  )
}
