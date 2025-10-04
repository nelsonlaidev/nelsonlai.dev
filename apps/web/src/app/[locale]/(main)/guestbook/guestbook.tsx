'use client'

import { useSession } from '@/hooks/queries/auth.query'

import MessageBox from './message-box'
import Messages from './messages'
import Pinned from './pinned'
import SignIn from './sign-in'

const Guestbook = () => {
  const { data: session } = useSession()

  return (
    <div className='mx-auto max-w-xl space-y-10'>
      <Pinned />
      {session ? <MessageBox user={session.user} /> : <SignIn />}
      <Messages />
    </div>
  )
}

export default Guestbook
