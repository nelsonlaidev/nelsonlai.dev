import type { SettingsGetOutput } from '@/orpc/client'

import { useForm, useStore } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'
import { useUpdateSettings } from '@/hooks/queries/settings.query'

import { Spinner } from './ui/spinner'

type SettingsFormProps = {
  settings: SettingsGetOutput
}

const SettingsFormSchema = z.object({
  replyNotificationsEnabled: z.boolean(),
})

function SettingsForm(props: SettingsFormProps) {
  const { settings } = props
  const t = useTranslations()

  const form = useForm({
    defaultValues: {
      replyNotificationsEnabled: settings.replyNotificationsEnabled,
    },
    validators: {
      onChange: SettingsFormSchema,
    },
    onSubmit: ({ value }) => {
      if (isUpdating) return
      updateSettings(value)
    },
  })

  const { mutate: updateSettings, isPending: isUpdating } = useUpdateSettings(() => {
    form.reset()
    toast.success(t('success.settings-updated'))
  })

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    void form.handleSubmit()
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
                        <FieldLabel htmlFor={field.name}>{t('settings.reply-notification')}</FieldLabel>
                        <FieldDescription>{t('settings.reply-notification-description')}</FieldDescription>
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </FieldContent>
                      <Switch
                        id={field.name}
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
          {isUpdating && <Spinner />}
          {t('common.save')}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default SettingsForm
