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
    <div className='flex flex-col items-stretch gap-5.5 rounded-xl border border-[#9abda32b] bg-[#153b3a19] p-7.5 text-base/normal text-[#b1cbc4] max-[601px]:px-5 max-[601px]:py-6'>
      <label htmlFor={fieldId} className='mx-0 mt-0 mb-3.25 block text-sm/normal text-[#bad3be]'>
        {m.guestbook_placeholder()}
      </label>
      <Textarea
        id={fieldId}
        rows={5}
        placeholder={m.ocean_message_placeholder()}
        disabled
        maxLength={GUESTBOOK_MESSAGE_MAX_LENGTH}
        className='max-h-87.5 min-h-37.5 w-full resize-y rounded-md border border-input bg-input/50 px-2.5 py-2 text-base/[1.65] leading-[1.65] text-[#d7e5d0] shadow-xs transition-[border-color,box-shadow] duration-200 ease-linear placeholder:text-[#8eaf9d] focus-visible:border-ring focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--ring)_50%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-[5px] focus-visible:outline-[#c4e0cc] focus-visible:outline-solid disabled:[background:color-mix(in_oklab,var(--input)_50%,transparent)] aria-invalid:border-destructive aria-invalid:shadow-[0_0_0_3px_color-mix(in_oklab,var(--destructive)_20%,transparent)] md:text-base/[1.65] dark:bg-transparent dark:disabled:bg-input/50'
      />
      <DialogTrigger
        handle={signInDialogHandle}
        render={
          <Button className='inline-flex h-auto min-h-12 cursor-pointer items-center justify-center gap-7 rounded-md border border-[#a7cabb65] bg-[#b0d3c30b] px-5.75 py-3.5 text-sm/5 text-[#e0ecde] transition-colors duration-200 ease-linear hover:border-[#c4e0cc] hover:bg-[#b0d3c31c] disabled:cursor-wait disabled:opacity-[0.5] motion-reduce:transition-none' />
        }
      >
        {m.common_sign_in()}
      </DialogTrigger>
      <p>
        {m.common_sign_in()} {m.guestbook_signin_description()}
      </p>
    </div>
  )
}
