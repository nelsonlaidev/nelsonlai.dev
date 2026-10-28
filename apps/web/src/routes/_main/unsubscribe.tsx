import { Button } from '@repo/ui/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card'
import { Spinner } from '@repo/ui/components/spinner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { BellOffIcon } from 'lucide-react'
import * as z from 'zod'

import { PageHeader } from '@/components/page-header'
import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/_main/unsubscribe')({
  validateSearch: (search) => {
    const parsed = z.object({ token: z.string().max(4096).optional() }).safeParse(search)
    return parsed.success ? parsed.data : { token: undefined }
  },
  head: () => ({
    meta: [
      { title: m.common_labels_unsubscribe() },
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'referrer', content: 'no-referrer' },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { token } = Route.useSearch()
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
        const queryKey = orpc.notifications.inspectUnsubscribe.queryOptions({ input }).queryKey
        queryClient.setQueryData(queryKey, (previous) => (previous ? { ...previous, isUnsubscribed: true } : previous))
      },
    }),
  )

  if (!token || query.isError)
    return (
      <PageHeader
        title={m.unsubscribe_invalid_unsubscribe_link()}
        description={m.unsubscribe_invalid_link_description()}
      />
    )

  let content: React.ReactNode = (
    <CardContent className='flex justify-center'>
      <Spinner />
    </CardContent>
  )

  if (query.data && !query.data.isUnsubscribed) {
    content = (
      <CardContent className='space-y-8'>
        <div className='space-y-2'>
          <p>{m.common_labels_comment()}</p>
          <blockquote className='rounded-xl border p-3 text-sm text-pretty wrap-break-word whitespace-pre-wrap text-muted-foreground dark:bg-input/30'>
            {query.data.comment}
          </blockquote>
        </div>
        <div className='space-y-3'>
          <Button
            disabled={unsubscribe.isPending}
            className='w-full'
            onClick={() => {
              if (!unsubscribe.isPending) unsubscribe.mutate({ token })
            }}
          >
            {unsubscribe.isPending && <Spinner />}
            {m.common_labels_unsubscribe()}
          </Button>
          <p className='text-center text-xs text-balance text-muted-foreground'>
            {m.unsubscribe_you_are_unsubscribing_as({ email: query.data.userEmail })}
          </p>
        </div>
      </CardContent>
    )
  } else if (query.data) {
    content = null
  }

  return (
    <div className='flex justify-center py-12'>
      <Card className='w-full max-w-lg'>
        <CardHeader className='space-y-4 text-center'>
          <div className='mx-auto flex size-16 items-center justify-center rounded-full bg-accent'>
            <BellOffIcon className='size-8' aria-hidden='true' />
          </div>
          <div className='space-y-2'>
            <CardTitle className='text-2xl text-balance'>
              {query.data?.isUnsubscribed
                ? m.unsubscribe_you_have_been_unsubscribed()
                : m.unsubscribe_unsubscribe_from_this_comment()}
            </CardTitle>
            <CardDescription className='text-base text-pretty text-muted-foreground'>
              {query.data?.isUnsubscribed
                ? m.unsubscribe_unsubscribed_description()
                : m.unsubscribe_stop_receiving_email_notifications()}
            </CardDescription>
          </div>
        </CardHeader>
        {content}
        {unsubscribe.isError && <CardContent role='alert'>{m.error_something_went_wrong()}</CardContent>}
      </Card>
    </div>
  )
}
