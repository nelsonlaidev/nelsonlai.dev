import { SiGithub } from '@icons-pack/react-simple-icons'
import { ParaglideMessage } from '@inlang/paraglide-js-react'
import { authClient } from '@repo/auth/client'
import { Badge } from '@repo/ui/components/badge'
import { Button } from '@repo/ui/components/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPrimitive,
  DialogTitle,
} from '@repo/ui/components/dialog'
import { Spinner } from '@repo/ui/components/spinner'
import { toast } from '@repo/ui/components/toast'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'

import { m } from '@/paraglide/messages'
import { getLocale, localizeUrl } from '@/paraglide/runtime'

export const signInDialogHandle = DialogPrimitive.createHandle<unknown>()

const PROVIDERS = ['github', 'google'] as const

type Provider = (typeof PROVIDERS)[number]

export function SignInDialog() {
  const [isPending, setIsPending] = useState(false)
  const lastMethod = authClient.getLastUsedLoginMethod()

  async function handleSignIn(provider: Provider) {
    if (isPending) return

    setIsPending(true)

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: localizeUrl(new URL(globalThis.location.href), { locale: getLocale() }).href,
      })

      if (error) {
        toast.add({ type: 'error', title: error.message })
      }
    } catch {
      toast.add({ type: 'error', title: m.error_sign_in_error() })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog handle={signInDialogHandle}>
      <DialogContent
        className='max-h-[calc(100dvh-32px)] max-w-[min(480px,calc(100vw-32px))] overflow-y-auto border shadow-md ring-0 sm:max-w-[min(480px,calc(100vw-32px))]'
        aria-busy={isPending}
      >
        <DialogHeader>
          <DialogTitle className='pr-8 text-2xl/tight tracking-tight'>{m.common_sign_in()}</DialogTitle>
          <DialogDescription className='leading-relaxed'>{m.auth_sign_in_description()}</DialogDescription>
        </DialogHeader>
        <div className='my-2 flex flex-col gap-4'>
          {PROVIDERS.map((provider) => {
            let icon = provider === 'github' ? <SiGithub aria-hidden='true' /> : <GoogleIcon />

            if (isPending) {
              icon = <Spinner />
            }

            return (
              <Button
                key={provider}
                className='relative w-full whitespace-normal'
                size='lg'
                variant={provider === 'github' ? 'default' : 'outline'}
                disabled={isPending}
                onClick={() => {
                  void handleSignIn(provider)
                }}
              >
                {icon}
                {m.auth_sign_in_continue_with({ provider: provider === 'github' ? 'GitHub' : 'Google' })}
                {lastMethod === provider && (
                  <Badge variant='outline' className='absolute -top-2 right-2 bg-background'>
                    {m.auth_sign_in_last_used()}
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>
        <div className='text-center text-sm/relaxed text-muted-foreground'>
          <ParaglideMessage
            message={m.auth_sign_in_notice}
            markup={{
              terms: ({ children }) => (
                <DialogClose nativeButton={false} render={<Link to='/terms' className='text-foreground underline' />}>
                  {children}
                </DialogClose>
              ),
              privacy: ({ children }) => (
                <DialogClose nativeButton={false} render={<Link to='/privacy' className='text-foreground underline' />}>
                  {children}
                </DialogClose>
              ),
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function GoogleIcon() {
  return (
    <svg aria-hidden='true' version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
      <path
        fill='#EA4335'
        d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'
      />
      <path
        fill='#4285F4'
        d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'
      />
      <path
        fill='#FBBC05'
        d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'
      />
      <path
        fill='#34A853'
        d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'
      />
      <path fill='none' d='M0 0h48v48H0z' />
    </svg>
  )
}
