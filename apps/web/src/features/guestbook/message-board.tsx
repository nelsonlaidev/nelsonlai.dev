import { Skeleton } from '@repo/ui/components/skeleton'

import { useSignOut } from '@/features/auth/use-sign-out'
import { authClient } from '@/lib/auth-client'
import { m } from '@/paraglide/messages'

import { MessageBox } from './message-box'
import { Messages } from './messages'
import { Pinned } from './pinned'
import { SignIn } from './sign-in'

export function MessageBoard() {
  const session = authClient.useSession()
  const { isSigningOut, signOut } = useSignOut()

  let composer: React.ReactNode

  if (session.isPending) {
    composer = (
      <output aria-label={m.common_aria_labels_loading()} className='flex gap-3'>
        <Skeleton aria-hidden='true' className='size-10 shrink-0 rounded-full' />
        <div aria-hidden='true' className='w-full space-y-4'>
          <Skeleton className='h-16 w-full' />
          <div className='flex justify-end gap-2'>
            <Skeleton className='h-9 w-20 rounded-4xl' />
            <Skeleton className='h-9 w-20 rounded-4xl' />
          </div>
        </div>
      </output>
    )
  } else if (session.data) {
    composer = (
      <MessageBox
        user={session.data.user}
        isSigningOut={isSigningOut}
        onSignOut={async () => {
          await signOut()
        }}
      />
    )
  } else {
    composer = <SignIn />
  }

  return (
    <div className='mx-auto max-w-xl space-y-10'>
      <Pinned />
      {composer}
      <Messages userId={session.data?.user.id} />
    </div>
  )
}
