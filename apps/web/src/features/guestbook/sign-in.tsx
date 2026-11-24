import { GUESTBOOK_MESSAGE_MAX_LENGTH } from '@repo/api/schema/guestbook'
import { Button } from '@repo/ui/components/button'
import { DialogTrigger } from '@repo/ui/components/dialog'
import { Textarea } from '@repo/ui/components/textarea'
import { useId } from 'react'

import { signInDialogHandle } from '@/features/auth/sign-in-dialog'
import { m } from '@/paraglide/messages'

export function SignIn() {
  const fieldId = useId()

  return (
    <div className='flex flex-col items-stretch gap-6 rounded-xl border bg-card/10 px-5 py-6 text-base text-muted-foreground sm:p-8'>
      <label htmlFor={fieldId} className='sr-only'>
        {m.guestbook_placeholder()}
      </label>
      <Textarea
        id={fieldId}
        placeholder={m.guestbook_message_placeholder()}
        disabled
        maxLength={GUESTBOOK_MESSAGE_MAX_LENGTH}
        className='max-h-96 min-h-36'
      />
      <DialogTrigger handle={signInDialogHandle} render={<Button variant='outline' size='lg' />}>
        {m.common_sign_in()}
      </DialogTrigger>
      <p>{m.guestbook_signin_description()}</p>
    </div>
  )
}
