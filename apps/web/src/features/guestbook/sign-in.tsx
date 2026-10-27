import { Button } from '@repo/ui/components/button'
import { DialogTrigger } from '@repo/ui/components/dialog'

import { signInDialogHandle } from '@/features/auth/sign-in-dialog'
import { m } from '@/paraglide/messages'

export function SignIn() {
  return (
    <>
      <DialogTrigger
        handle={signInDialogHandle}
        render={
          <Button className='inline-block bg-linear-to-br from-[#fcd34d] via-[#ef4444] to-[#ec4899] font-semibold dark:text-foreground' />
        }
      >
        {m.common_sign_in()}
      </DialogTrigger>
      <span className='ml-2'>{m.guestbook_signin_description()}</span>
    </>
  )
}
