import type { Session } from '@repo/auth'

import { CreateGuestbookMessageInputSchema, GUESTBOOK_MESSAGE_MAX_LENGTH } from '@repo/api/schema/guestbook'
import { Button } from '@repo/ui/components/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@repo/ui/components/field'
import { Textarea } from '@repo/ui/components/textarea'
import { toast } from '@repo/ui/components/toast'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useId } from 'react'

import { UserAvatar } from '@/components/user-avatar'
import { getMutationErrorMessage } from '@/lib/get-mutation-error-message'
import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

type MessageBoxProps = {
  user: Session['user']
  isSigningOut: boolean
  onSignOut: () => Promise<void>
}

export function MessageBox(props: MessageBoxProps) {
  const { user, isSigningOut, onSignOut } = props
  const inputId = useId()
  const errorId = `${inputId}-error`
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: {
      body: '',
    },
    validators: {
      onSubmit: CreateGuestbookMessageInputSchema,
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
        toast.add({ type: 'success', title: m.success_message_created() })
        void queryClient.invalidateQueries({ queryKey: orpc.guestbook.list.key() })
      },
      onError: (error) => {
        toast.add({ type: 'error', title: getMutationErrorMessage(error, m.error_create_message_failed()) })
      },
    }),
  )

  const isBusy = creation.isPending || isSigningOut

  return (
    <div className='rounded-xl border bg-card/10 px-5 py-6 sm:p-8'>
      <div className='mb-6 flex items-center gap-3'>
        <UserAvatar id={user.id} name={user.name} image={user.image} size='lg' />
        <span>{user.name}</span>
      </div>
      <form
        className='w-full space-y-4'
        aria-busy={isBusy}
        onSubmit={async (event) => {
          event.preventDefault()
          await form.handleSubmit()
        }}
      >
        <FieldGroup>
          <form.Field name='body'>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={inputId} className='sr-only'>
                    {m.guestbook_placeholder()}
                  </FieldLabel>
                  <Textarea
                    id={inputId}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      field.handleChange(event.target.value)
                    }}
                    aria-invalid={isInvalid}
                    aria-describedby={isInvalid ? errorId : undefined}
                    placeholder={m.guestbook_placeholder()}
                    maxLength={GUESTBOOK_MESSAGE_MAX_LENGTH}
                    disabled={isBusy}
                    className='max-h-96 min-h-36'
                  />
                  {isInvalid && (
                    <FieldError
                      id={errorId}
                      errors={field.state.meta.errors.map((error) => {
                        if (error && 'code' in error) {
                          if (error.code === 'too_small') return { message: m.error_message_cannot_be_empty() }
                          if (error.code === 'too_big') {
                            return { message: m.error_message_too_long({ limit: GUESTBOOK_MESSAGE_MAX_LENGTH }) }
                          }
                        }
                        return error
                      })}
                    />
                  )}
                </Field>
              )
            }}
          </form.Field>
        </FieldGroup>
        <form.Subscribe selector={(state) => state.values.body.length}>
          {(length) => (
            <p className='text-right text-sm text-muted-foreground'>
              {length}/{GUESTBOOK_MESSAGE_MAX_LENGTH}
            </p>
          )}
        </form.Subscribe>
        <div className='flex items-center justify-end gap-3'>
          <Button type='button' variant='ghost' onClick={onSignOut} disabled={isBusy} className='text-link'>
            {m.common_sign_out()}
          </Button>
          <Button type='submit' disabled={isBusy}>
            {creation.isPending ? m.common_loading() : m.guestbook_message_submit()}
          </Button>
        </div>
      </form>
    </div>
  )
}
