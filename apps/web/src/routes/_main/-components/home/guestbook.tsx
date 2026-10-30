import { ORPCError } from '@orpc/client'
import { CreateGuestbookMessageInputSchema } from '@repo/api/schema/guestbook'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'
import { useId, useState } from 'react'

import { signInDialogHandle } from '@/features/auth/sign-in-dialog'
import { useSignOut } from '@/features/auth/use-sign-out'
import { guestbookMessagesOptions } from '@/features/guestbook/guestbook.queries'
import { authClient } from '@/lib/auth-client'
import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

export function HomeGuestbook() {
  return (
    <section
      id='guestbook'
      aria-labelledby='guestbook-title'
      className='relative mx-auto w-full max-w-400 scroll-mt-12.5 pt-32.5 pr-[max(16px,env(safe-area-inset-right))] pb-8.75 pl-[max(16px,env(safe-area-inset-left))] min-[701px]:min-h-svh min-[701px]:scroll-mt-17.5 min-[701px]:px-[10%] min-[701px]:pt-47.5'
    >
      <div className='text-center'>
        <Link to='/guestbook' className='mb-17.5 block text-xs text-primary'>
          04 / {m.ocean_guestbook_visit()}
        </Link>
        <span
          className='absolute top-32.5 left-1/2 block size-1.25 rounded-full bg-[#e2f6d1] shadow-[0_0_25px_8px_#92d9bd50,0_0_100px_45px_#5aab9920] min-[701px]:top-47.5'
          aria-hidden='true'
        />
        <h2 id='guestbook-title' className='text-[clamp(36px,4.1vw,64px)] leading-[1.12] font-[410] tracking-tighter'>
          {m.ocean_guestbook_title()}
          <br />
          <em className='font-serif tracking-[-0.04em] text-primary'>{m.ocean_guestbook_emphasis()}</em>
        </h2>
        <p className='mx-auto mt-6 max-w-lg text-base/[1.65] whitespace-pre-line text-muted-foreground'>
          {m.ocean_guestbook_description()}
        </p>
      </div>
      <GuestbookComposer />
    </section>
  )
}

function GuestbookComposer() {
  const fieldId = useId()
  const errorId = useId()
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const session = authClient.useSession()
  const { signOut, isSigningOut } = useSignOut()
  const queryClient = useQueryClient()
  const messages = useInfiniteQuery(guestbookMessagesOptions)
  const latest = messages.data?.pages[0]?.messages[0]
  const creation = useMutation(
    orpc.guestbook.create.mutationOptions({
      onSuccess: () => {
        setBody('')
        setError('')
        setStatus(m.success_message_created())
        void queryClient.invalidateQueries({ queryKey: orpc.guestbook.list.key() })
      },
      onError: (failure) => {
        setError(
          failure instanceof ORPCError && failure.code === 'TOO_MANY_REQUESTS'
            ? m.error_too_many_requests()
            : m.error_create_message_failed(),
        )
      },
    }),
  )
  const busy = session.isPending || creation.isPending || isSigningOut

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const result = CreateGuestbookMessageInputSchema.safeParse({ body })
    if (!result.success) {
      setError(m.error_message_cannot_be_empty())
      return
    }
    if (!session.data) {
      signInDialogHandle.open(null)
      return
    }
    creation.mutate(result.data)
  }

  return (
    <div className='mx-auto max-w-125'>
      <form
        className='mt-10.5 rounded-xl border border-[#a1c9c030] bg-[#0d2e3b38] p-4.75 min-[701px]:p-5.75'
        onSubmit={handleSubmit}
        aria-busy={busy}
      >
        <label htmlFor={fieldId} className='mb-4 block text-sm text-[#a5c6bd]'>
          {m.ocean_message_label()}
        </label>
        <textarea
          id={fieldId}
          value={body}
          onChange={(event) => {
            setBody(event.target.value)
            setError('')
            setStatus('')
          }}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
          placeholder={m.ocean_message_placeholder()}
          maxLength={280}
          required
          rows={3}
          disabled={creation.isPending || isSigningOut}
          className='max-h-62.5 min-h-22.5 w-full resize-y rounded-md border border-input bg-transparent px-2.5 py-2 text-base/[1.65] text-[#e2eade] shadow-xs transition-[color,box-shadow] placeholder:text-[#779b9a] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-2 focus-visible:outline-offset-[5px] focus-visible:outline-[#c4e0cc] focus-visible:outline-solid disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20'
        />
        {error && (
          <p id={errorId} role='alert' className='mt-3 text-sm text-[#f5b9b9]'>
            {error}
          </p>
        )}
        <div className='mt-4 flex items-center justify-between gap-4'>
          <span className='text-sm text-[#8cadaa]'>{body.length}/280</span>
          <button
            type='submit'
            disabled={busy}
            className='flex min-h-11 items-center gap-1.5 rounded-md border border-input px-2.5 text-sm transition-colors hover:bg-accent disabled:opacity-50'
          >
            {creation.isPending ? m.common_loading() : m.ocean_message_submit()}
            <ArrowRightIcon className='size-5' aria-hidden='true' />
          </button>
        </div>
      </form>
      <div aria-live='polite'>
        {latest && (
          <div className='mt-5 flex items-center gap-4 border border-[#8bcbb920] bg-[#8bcbb908] p-5 text-sm'>
            <span
              className='size-1.25 shrink-0 rounded-full bg-[#bdedc3] shadow-[0_0_12px_#a4edb5]'
              aria-hidden='true'
            />
            <p className='min-w-0 flex-1 text-base/[1.65] wrap-anywhere'>{latest.body}</p>
            <Link to='/guestbook' aria-label={m.nav_guestbook()} className='inline-flex min-h-11 shrink-0 items-center'>
              <ArrowRightIcon className='size-5' aria-hidden='true' />
            </Link>
          </div>
        )}
        {messages.isPending && <p className='mt-5 text-center text-sm text-muted-foreground'>{m.common_loading()}</p>}
        {messages.isError && (
          <p className='mt-5 text-center text-sm text-muted-foreground'>{m.error_failed_to_load_messages()}</p>
        )}
        {messages.isSuccess && !latest && (
          <p className='mt-5 text-center text-sm text-muted-foreground'>{m.guestbook_no_messages()}</p>
        )}
        <output className='mt-5 block text-center text-sm/relaxed text-[#8cadaa]'>{status}</output>
      </div>
      <div className='mt-3 text-center text-sm text-muted-foreground'>
        {session.data ? (
          <button
            type='button'
            disabled={busy}
            onClick={() => {
              void signOut()
            }}
            className='min-h-11 underline underline-offset-4'
          >
            {m.common_sign_out()}
          </button>
        ) : (
          <button
            type='button'
            onClick={() => {
              signInDialogHandle.open(null)
            }}
            className='min-h-11 underline underline-offset-4'
          >
            {m.common_sign_in()} {m.guestbook_signin_description()}
          </button>
        )}
      </div>
    </div>
  )
}
