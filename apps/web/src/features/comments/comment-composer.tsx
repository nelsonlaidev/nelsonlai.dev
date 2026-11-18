import { CreateCommentInputSchema } from '@repo/api/schema/comments'
import { authClient } from '@repo/auth/client'
import { Button } from '@repo/ui/components/button'
import { DialogTrigger } from '@repo/ui/components/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@repo/ui/components/field'
import { toast } from '@repo/ui/components/toast'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SendIcon } from 'lucide-react'
import { useId, useState } from 'react'
import { Skeleton } from 'skullet/react'

import { signInDialogHandle } from '@/features/auth/sign-in-dialog'
import { getMutationErrorMessage } from '@/lib/get-mutation-error-message'
import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'

import { CommentEditor } from './comment-editor'

type CommentComposerProps = {
  slug: string
  parentId?: string
  onCancel?: () => void
}

export function CommentComposer(props: CommentComposerProps) {
  const { slug, parentId, onCancel } = props
  const inputId = useId()
  const errorId = `${inputId}-error`
  const [tabsValue, setTabsValue] = useState('write')
  const session = authClient.useSession()
  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues: { body: '' },
    validators: {
      onSubmit: CreateCommentInputSchema.pick({ body: true }),
    },
    onSubmit: ({ value }) => {
      if (!session.data || creation.isPending) return
      creation.mutate({ slug, parentId, body: value.body.trim(), locale: getLocale() })
    },
  })

  const creation = useMutation(
    orpc.comments.create.mutationOptions({
      onSuccess: () => {
        form.reset()
        setTabsValue('write')
        void queryClient.invalidateQueries({ queryKey: orpc.comments.key() })
        toast.add({
          type: 'success',
          title: parentId ? m.success_reply_posted() : m.success_comment_posted(),
        })
        onCancel?.()
      },
      onError: (error) => {
        toast.add({
          type: 'error',
          title: getMutationErrorMessage(
            error,
            parentId ? m.error_create_reply_failed() : m.error_create_comment_failed(),
          ),
        })
      },
    }),
  )

  return (
    <Skeleton loading={session.isPending} label={m.common_aria_labels_loading()}>
      <form
        onSubmit={async (event) => {
          event.preventDefault()
          await form.handleSubmit()
        }}
        className='space-y-3'
        aria-busy={creation.isPending}
      >
        <FieldGroup>
          <form.Field name='body'>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={inputId} className='sr-only'>
                    {parentId ? m.blog_comments_reply_to_comment() : m.blog_comments_placeholder()}
                  </FieldLabel>
                  <div className='relative'>
                    <CommentEditor
                      id={inputId}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                      aria-describedby={isInvalid ? errorId : undefined}
                      onChange={field.handleChange}
                      onSubmit={() => {
                        void form.handleSubmit()
                      }}
                      onCancel={onCancel}
                      disabled={!session.data || creation.isPending}
                      isReply={Boolean(parentId)}
                      tabsValue={tabsValue}
                      onTabsValueChange={setTabsValue}
                    />
                    {!parentId && (
                      <Button
                        type='submit'
                        variant='ghost'
                        size='icon-xs'
                        className='absolute right-2.5 bottom-2'
                        disabled={!session.data || creation.isPending || !field.state.value.trim()}
                        aria-label={m.blog_comments_send_comment()}
                        skullet-ignore=''
                      >
                        <SendIcon className='size-4' aria-hidden='true' />
                      </Button>
                    )}
                    {!session.isPending && !session.data && (
                      <div className='absolute inset-0 flex items-center justify-center rounded-md bg-black/5 backdrop-blur-[0.8px]'>
                        <DialogTrigger
                          handle={signInDialogHandle}
                          render={<Button type='button' size='sm' disabled={session.isPending} />}
                        >
                          {m.common_sign_in()}
                        </DialogTrigger>
                      </div>
                    )}
                  </div>
                  {isInvalid && (
                    <FieldError
                      id={errorId}
                      errors={field.state.meta.errors.map((error) => {
                        if (error && 'code' in error) {
                          if (error.code === 'too_small') {
                            return {
                              message: parentId ? m.error_reply_cannot_be_empty() : m.error_comment_cannot_be_empty(),
                            }
                          }
                          if (error.code === 'too_big') {
                            return { message: m.error_message_too_long({ limit: 10_000 }) }
                          }
                        }
                        return { message: m.error_something_went_wrong() }
                      })}
                    />
                  )}
                  {parentId && (
                    <div className='mt-2 flex items-center gap-1'>
                      <Button
                        type='submit'
                        variant='secondary'
                        size='sm'
                        disabled={!session.data || creation.isPending || !field.state.value.trim()}
                      >
                        {m.blog_comments_reply()}
                      </Button>
                      {onCancel && (
                        <Button
                          type='button'
                          variant='secondary'
                          size='sm'
                          onClick={onCancel}
                          disabled={creation.isPending}
                        >
                          {m.common_cancel()}
                        </Button>
                      )}
                    </div>
                  )}
                </Field>
              )
            }}
          </form.Field>
        </FieldGroup>
      </form>
    </Skeleton>
  )
}
