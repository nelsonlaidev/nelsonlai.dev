import { Button } from '@repo/ui/components/button'
import { Card, CardContent, CardFooter } from '@repo/ui/components/card'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@repo/ui/components/field'
import { Spinner } from '@repo/ui/components/spinner'
import { Switch } from '@repo/ui/components/switch'
import { toast } from '@repo/ui/components/toast'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useId } from 'react'
import { Skeleton } from 'skullet/react'

import { replyPreferenceQueryOptions } from '@/features/notifications/notifications.queries'
import { getMutationErrorMessage } from '@/lib/get-mutation-error-message'
import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

type NotificationSettingsProps = {
  userId: string
}

export function NotificationSettings(props: NotificationSettingsProps) {
  const { userId } = props
  const preference = useQuery(replyPreferenceQueryOptions(userId))

  if (preference.isError) return <p role='alert'>{m.error_failed_to_load_settings()}</p>

  return (
    <Skeleton data={preference.data?.repliesEnabled} sample={true} label={m.common_aria_labels_loading()}>
      {(repliesEnabled) => <NotificationSettingsForm userId={userId} repliesEnabled={repliesEnabled} />}
    </Skeleton>
  )
}

type NotificationSettingsFormProps = NotificationSettingsProps & {
  repliesEnabled: boolean
}

function NotificationSettingsForm(props: NotificationSettingsFormProps) {
  const { userId, repliesEnabled } = props
  const inputId = useId()
  const descriptionId = `${inputId}-description`
  const formId = `${inputId}-form`
  const queryClient = useQueryClient()
  const update = useMutation(
    orpc.notifications.setPreference.mutationOptions({
      onSuccess: (data) => {
        queryClient.setQueryData(replyPreferenceQueryOptions(userId).queryKey, data)
        form.reset(data)
        toast.add({ type: 'success', title: m.success_settings_updated() })
      },
      onError: (error) => {
        toast.add({
          type: 'error',
          title: getMutationErrorMessage(error, m.error_update_notification_settings_failed()),
        })
      },
    }),
  )
  const form = useForm({
    defaultValues: { repliesEnabled },
    onSubmit: ({ value }) => {
      if (update.isPending) return

      update.mutate(value)
    },
  })

  return (
    <Card>
      <CardContent className='wrap-anywhere'>
        <form
          id={formId}
          className='space-y-6'
          aria-busy={update.isPending}
          onSubmit={async (event) => {
            event.preventDefault()
            await form.handleSubmit()
          }}
        >
          <h2 className='text-lg font-semibold'>{m.settings_notification_settings()}</h2>
          <form.Field name='repliesEnabled'>
            {(field) => (
              <Field orientation='horizontal'>
                <FieldContent>
                  <FieldLabel htmlFor={inputId}>{m.settings_reply_notification()}</FieldLabel>
                  <FieldDescription id={descriptionId}>{m.settings_reply_notification_description()}</FieldDescription>
                </FieldContent>
                <Switch
                  id={inputId}
                  name={field.name}
                  checked={field.state.value}
                  onBlur={field.handleBlur}
                  onCheckedChange={field.handleChange}
                  aria-describedby={descriptionId}
                  disabled={update.isPending}
                />
              </Field>
            )}
          </form.Field>
        </form>
      </CardContent>
      <form.Subscribe selector={(state) => state.values.repliesEnabled !== repliesEnabled}>
        {(isChanged) => (
          <CardFooter className='justify-end gap-2 border-t'>
            {isChanged && (
              <Button
                type='button'
                variant='outline'
                disabled={update.isPending}
                onClick={() => {
                  form.reset()
                }}
              >
                {m.common_reset()}
              </Button>
            )}
            <Button type='submit' form={formId} disabled={!isChanged || update.isPending}>
              {update.isPending && <Spinner />}
              {m.common_save()}
            </Button>
          </CardFooter>
        )}
      </form.Subscribe>
    </Card>
  )
}
