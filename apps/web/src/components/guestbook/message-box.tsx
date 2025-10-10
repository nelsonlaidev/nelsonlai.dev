'use client'

import type { User } from '@/lib/auth-client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar'
import { Button } from '@repo/ui/components/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@repo/ui/components/form'
import { toast } from '@repo/ui/components/sonner'
import { Textarea } from '@repo/ui/components/textarea'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useCreateGuestbookMessage } from '@/hooks/queries/guestbook.query'
import { useSignOut } from '@/hooks/use-sign-out'
import { getAbbreviation } from '@/utils/get-abbreviation'
import { getDefaultImage } from '@/utils/get-default-image'

type MessageBoxProps = {
  user: User
}

const MessageBox = (props: MessageBoxProps) => {
  const { user } = props
  const t = useTranslations()
  const signOut = useSignOut()

  const guestbookFormSchema = z.object({
    message: z.string().min(1, t('error.message-cannot-be-empty'))
  })

  const form = useForm<z.infer<typeof guestbookFormSchema>>({
    resolver: zodResolver(guestbookFormSchema),
    defaultValues: {
      message: ''
    }
  })

  const { mutate: createMessage, isPending: isCreating } = useCreateGuestbookMessage(() => {
    form.reset()
    toast.success(t('guestbook.create-message-successfully'))
  })

  const onSubmit = (values: z.infer<typeof guestbookFormSchema>) => {
    if (isCreating) return
    createMessage({ message: values.message })
  }

  const defaultImage = getDefaultImage(user.id)

  return (
    <div className='flex gap-3'>
      <Avatar className='size-10'>
        <AvatarImage src={user.image ?? defaultImage} alt={user.name} />
        <AvatarFallback>{getAbbreviation(user.name)}</AvatarFallback>
      </Avatar>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
          <FormField
            control={form.control}
            name='message'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder={t('guestbook.placeholder')} data-testid='guestbook-textarea' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='mt-4 flex justify-end gap-2'>
            <Button variant='outline' onClick={signOut}>
              {t('common.sign-out')}
            </Button>
            <Button
              type='submit'
              disabled={isCreating}
              aria-disabled={isCreating}
              data-testid='guestbook-submit-button'
            >
              {t('guestbook.submit')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default MessageBox
