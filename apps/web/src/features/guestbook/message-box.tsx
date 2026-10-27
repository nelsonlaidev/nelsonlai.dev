import type { Session } from '@repo/auth'

import { ORPCError } from '@orpc/client'
import { CreateGuestbookMessageInputSchema } from '@repo/api/schema/guestbook'
import { Button } from '@repo/ui/components/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@repo/ui/components/field'
import { Textarea } from '@repo/ui/components/textarea'
import { toast } from '@repo/ui/components/toast'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useId } from 'react'

import { UserAvatar } from '@/components/user-avatar'
import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

type MessageBoxProps = {
  user: Session['user']
  isSigningOut: boolean
  onSignOut: () => Promise<void>
}

export function MessageBox(props: MessageBoxProps) {
  const { user, isSigningOut, onSignOut } = props
  const errorId = useId()
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: {
      body: '',
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = CreateGuestbookMessageInputSchema.safeParse(value, {
          error: (issue) => {
            if (issue.code === 'too_small') return m.error_message_cannot_be_empty()
            if (issue.code === 'too_big') return m.error_message_too_long({ limit: Number(issue.maximum) })
            return issue.message
          },
        })

        return result.success ? undefined : { fields: { body: result.error.issues } }
      },
    },
    onSubmit: ({ value }) => {
      if (isBusy) return
      creation.mutate(value)
    },
  })

  const creation = useMutation(
    orpc.guestbook.create.mutationOptions({
      onSuccess: () => {
        form.reset()

        toast.add({
          type: 'success',
          description: m.success_message_created(),
          data: { testId: 'guestbook-message-created-toast' },
        })

        void queryClient.invalidateQueries({ queryKey: orpc.guestbook.list.key() })
      },
      onError: (error) => {
        toast.add({
          type: 'error',
          description:
            error instanceof ORPCError && error.code === 'TOO_MANY_REQUESTS'
              ? m.error_too_many_requests()
              : m.error_create_message_failed(),
        })
      },
    }),
  )

  const isBusy = creation.isPending || isSigningOut

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    await form.handleSubmit()
  }

  return (
    <div className='flex gap-3'>
      <UserAvatar id={user.id} name={user.name} image={user.image} size='lg' />
      <form onSubmit={handleSubmit} className='w-full space-y-4'>
        <FieldGroup>
          <form.Field name='body'>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name} className='sr-only'>
                    {m.guestbook_placeholder()}
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      field.handleChange(event.target.value)
                    }}
                    aria-invalid={isInvalid}
                    aria-describedby={isInvalid ? errorId : undefined}
                    placeholder={m.guestbook_placeholder()}
                    disabled={isBusy}
                    data-testid='guestbook-textarea'
                  />
                  {isInvalid && <FieldError id={errorId} errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
        </FieldGroup>
        <div className='flex items-center justify-end gap-2'>
          <Button variant='outline' onClick={onSignOut} disabled={isBusy}>
            {m.common_sign_out()}
          </Button>
          <Button type='submit' disabled={isBusy} data-testid='guestbook-submit-button'>
            {m.common_submit()}
          </Button>
        </div>
      </form>
    </div>
  )
}
