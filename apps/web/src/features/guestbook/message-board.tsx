import { authClient } from '@repo/auth/client'
import { Skeleton } from 'skullet/react'

import { useSignOut } from '@/features/auth/use-sign-out'
import { m } from '@/paraglide/messages'

import { MessageBox } from './message-box'
import { Messages } from './messages'
import { SignIn } from './sign-in'

export function MessageBoard() {
  const session = authClient.useSession()
  const { isSigningOut, signOut } = useSignOut()

  let composer: React.ReactNode = <SignIn />

  if (session.data) {
    composer = (
      <MessageBox
        user={session.data.user}
        isSigningOut={isSigningOut}
        onSignOut={async () => {
          await signOut()
        }}
      />
    )
  }

  return (
    <div className='mx-auto w-full max-w-2xl space-y-6'>
      <Skeleton loading={session.isPending} label={m.common_aria_labels_loading()}>
        {composer}
      </Skeleton>
      <Messages userId={session.data?.user.id} />
    </div>
  )
}
