'use client'

import type { User } from '@/lib/auth-client'

import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import * as z from 'zod'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { useCreateMessage } from '@/hooks/queries/message.query'
import { useSignOut } from '@/hooks/use-sign-out'
import { getAbbreviation } from '@/utils/get-abbreviation'
import { getDefaultImage } from '@/utils/get-default-image'

type MessageBoxProps = {
  user: User
}

function MessageBox(props: MessageBoxProps) {
  const { user } = props
  const t = useTranslations()
  const signOut = useSignOut()

  const GuestbookFormSchema = z.object({
    message: z.string().min(1, t('error.message-cannot-be-empty')),
  })

  const form = useForm({
    defaultValues: {
      message: '',
    },
    validators: {
      onSubmit: GuestbookFormSchema,
    },
    onSubmit: ({ value }) => {
      if (isCreating) return
      createMessage({ message: value.message })
    },
  })

  const { mutate: createMessage, isPending: isCreating } = useCreateMessage(() => {
    form.reset()
    toast.success(t('success.message-created'), { testId: 'guestbook-message-created-toast' })
  })

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    void form.handleSubmit()
  }

  const defaultImage = getDefaultImage(user.id)

  return (
    <div className='flex gap-3'>
      <Avatar className='size-10'>
        <AvatarImage src={user.image ?? defaultImage} alt={user.name} />
        <AvatarFallback>{getAbbreviation(user.name)}</AvatarFallback>
      </Avatar>
      <form onSubmit={handleSubmit} className='w-full'>
        <FieldGroup>
          <form.Field name='message'>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                    }}
                    aria-invalid={isInvalid}
                    placeholder={t('guestbook.placeholder')}
                    disabled={isCreating}
                    data-testid='guestbook-textarea'
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
        </FieldGroup>
        <div className='mt-4 flex justify-end gap-2'>
          <Button variant='outline' onClick={signOut} disabled={isCreating}>
            {t('common.sign-out')}
          </Button>
          <Button type='submit' disabled={isCreating} data-testid='guestbook-submit-button'>
            {t('guestbook.submit')}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default MessageBox
