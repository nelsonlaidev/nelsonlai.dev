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

  let composer: React.ReactNode = <SignIn />

  if (session.isPending) {
    composer = (
      <output
        aria-label={m.common_aria_labels_loading()}
        className='block min-h-88.75 rounded-xl border border-[#9abda32b] bg-[#153b3a19] p-7.5 max-[601px]:px-5 max-[601px]:py-6'
      >
        <Skeleton
          aria-hidden='true'
          className='size-10 shrink-0 rounded-full bg-[#b0d3c31a] motion-reduce:animate-none'
        />
        <div aria-hidden='true' className='w-full space-y-4'>
          <Skeleton className='h-38 w-full bg-[#b0d3c31a] motion-reduce:animate-none' />
          <div className='flex justify-end gap-2'>
            <Skeleton className='h-12 w-20 rounded-md bg-[#b0d3c31a] motion-reduce:animate-none' />
            <Skeleton className='h-12 w-20 rounded-md bg-[#b0d3c31a] motion-reduce:animate-none' />
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
  }

  return (
    <div className='mt-20 grid grid-cols-[1fr_1.15fr] items-start gap-23.75 max-[1101px]:gap-12.5 max-[851px]:gap-7.5 max-[601px]:mt-11.25 max-[601px]:block'>
      <Pinned />
      <div className='min-w-0'>
        {composer}
        <Messages userId={session.data?.user.id} />
      </div>
    </div>
  )
}
