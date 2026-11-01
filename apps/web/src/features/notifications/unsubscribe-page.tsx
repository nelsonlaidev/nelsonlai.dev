import { Button } from '@repo/ui/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card'
import { Spinner } from '@repo/ui/components/spinner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { BellOffIcon } from 'lucide-react'

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
  let title = m.common_loading()
  let description: string | undefined
  let content: React.ReactNode = (
    <CardContent className='flex justify-center'>
      <Spinner aria-label={m.common_loading()} />
    </CardContent>
  )

  if (isInvalid) {
    title = m.unsubscribe_invalid_unsubscribe_link()
    description = m.unsubscribe_invalid_link_description()
    content = null
  } else if (query.data?.isUnsubscribed) {
    title = m.unsubscribe_you_have_been_unsubscribed()
    description = m.unsubscribe_unsubscribed_description()
    content = null
  } else if (query.data) {
    title = m.unsubscribe_unsubscribe_from_this_comment()
    description = m.unsubscribe_stop_receiving_email_notifications()
    content = (
      <CardContent className='space-y-8'>
        <div className='space-y-2'>
          <p>{m.common_labels_comment()}</p>
          <blockquote className='rounded-none border bg-input/30 p-3 text-sm/[1.7] text-pretty wrap-break-word whitespace-pre-wrap text-[#cfddd3]'>
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
  }

  return (
    <MainLayout>
      <div className='relative mx-auto my-0 w-[min(84%,640px)] px-0 pt-41.25 pb-16.25 wrap-anywhere subpixel-antialiased max-[541px]:mx-4 max-[541px]:my-0 max-[541px]:w-auto max-[541px]:pt-32.5'>
        <Card
          className='w-full max-w-none rounded-xl border border-[#a6c9bc30] bg-[#062633] p-[clamp(24px,4vw,48px)] shadow-none ring-0'
          aria-busy={(Boolean(token) && query.isPending) || unsubscribe.isPending}
        >
          <CardHeader className='space-y-4 px-0 text-center'>
            <div className='mx-auto flex size-16 items-center justify-center rounded-full bg-accent'>
              <BellOffIcon className='size-8' aria-hidden='true' />
            </div>
            <div className={isInvalid ? 'space-y-4' : 'space-y-2'} aria-live='polite'>
              <CardTitle className='text-2xl text-balance'>
                <h1 className='text-[clamp(30px,4vw,46px)] leading-[1.1] font-[420] tracking-tighter text-[#edf3e8]'>
                  {title}
                </h1>
              </CardTitle>
              {description && (
                <CardDescription className='mt-5.5 text-base/[1.65] text-pretty text-[#bfd5cc]'>
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
        <Link to='/' className='mt-6 inline-flex min-h-11 items-center gap-4 text-sm/normal text-[#b9d3c7]'>
          {m.common_go_to_homepage()}
        </Link>
      </div>
    </MainLayout>
  )
}
