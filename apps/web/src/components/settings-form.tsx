import type { SettingsGetOutput } from '@/orpc/client'

import { Button } from '@repo/ui/components/button'
import { Card, CardContent, CardFooter } from '@repo/ui/components/card'
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@repo/ui/components/field'
import { Switch } from '@repo/ui/components/switch'
import { useForm, useStore } from '@tanstack/react-form'
import { Loader2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import * as z from 'zod'

import { useUpdateSettings } from '@/hooks/queries/settings.query'

type SettingsFormProps = {
  settings: SettingsGetOutput
}

const SettingsFormSchema = z.object({
  replyNotificationsEnabled: z.boolean()
})

function SettingsForm(props: SettingsFormProps) {
  const { settings } = props
  const t = useTranslations()

  const form = useForm({
    defaultValues: {
      replyNotificationsEnabled: settings.replyNotificationsEnabled
    },
    validators: {
      onChange: SettingsFormSchema
    },
    onSubmit: ({ value }) => {
      updateSettings(value)
    }
  })

  const { mutate: updateSettings, isPending: isUpdating } = useUpdateSettings(() => {
    form.reset()
    toast.success(t('success.settings-updated'))
  })

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    form.handleSubmit()
  }

  const isDirty = useStore(form.store, (state) => state.isDirty)

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-12' id='edit-settings-form'>
          <div className='space-y-6'>
            <h2 className='text-lg font-semibold'>{t('settings.notification-settings')}</h2>
            <FieldGroup>
              <form.Field name='replyNotificationsEnabled'>
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field orientation='horizontal' data-invalid={isInvalid}>
                      <FieldContent>
                        <FieldLabel htmlFor='reply-notifications-switch'>{t('settings.reply-notification')}</FieldLabel>
                        <FieldDescription>{t('settings.reply-notification-description')}</FieldDescription>
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </FieldContent>
                      <Switch
                        id='reply-notifications-switch'
                        name={field.name}
                        checked={field.state.value}
                        onCheckedChange={field.handleChange}
                        aria-invalid={isInvalid}
                        disabled={isUpdating}
                      />
                    </Field>
                  )
                }}
              </form.Field>
            </FieldGroup>
          </div>
        </form>
      </CardContent>
      <CardFooter className='justify-end gap-2'>
        {isDirty && (
          <Button
            type='button'
            variant='outline'
            onClick={() => {
              form.reset()
            }}
            disabled={isUpdating}
          >
            {t('common.reset')}
          </Button>
        )}
        <Button type='submit' form='edit-settings-form' disabled={!isDirty || isUpdating}>
          {isUpdating && <Loader2Icon className='animate-spin' />}
          {t('common.save')}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default SettingsForm
