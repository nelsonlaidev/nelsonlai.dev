'use client'

import type { User } from '@repo/db'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@repo/ui/components/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar'
import { Button } from '@repo/ui/components/button'
import { Card } from '@repo/ui/components/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/ui/components/form'
import { Input } from '@repo/ui/components/input'
import { toast } from '@repo/ui/components/sonner'
import { getAbbreviation } from '@repo/utils'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { useSession, useUpdateUser } from '@/hooks/queries/auth.query'
import { useFormattedDate } from '@/hooks/use-formatted-date'

import ProfileSkeleton from './profile-skeleton'

const Profile = () => {
  const { isSuccess, isLoading, isError, data } = useSession()
  const t = useTranslations()

  return (
    <div className='space-y-6'>
      <h2 className='text-lg font-semibold'>{t('account.profile')}</h2>
      <Card className='p-4 sm:p-6'>
        {isLoading && <ProfileSkeleton />}
        {isError && <div>{t('error.something-went-wrong')}</div>}
        {isSuccess && data && <ProfileInfo user={data.user} />}
      </Card>
    </div>
  )
}

type ProfileInfoProps = {
  user: User
}

const ProfileInfo = (props: ProfileInfoProps) => {
  const { user } = props
  const createdAt = useFormattedDate(user.createdAt)
  const t = useTranslations()

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground'>{t('account.avatar')}</span>
          <Avatar className='size-24'>
            <AvatarImage src={user.image ?? undefined} className='size-full' />
            <AvatarFallback>{getAbbreviation(user.name)}</AvatarFallback>
          </Avatar>
        </div>
        <Button variant='outline'>{t('account.update-avatar')}</Button>
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground'>{t('account.display-name')}</span>
          <span>{user.name}</span>
        </div>
        <EditName name={user.name} />
      </div>
      <div>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground'>{t('account.email')}</span>
          <span>{user.email}</span>
        </div>
      </div>
      <div>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground'>{t('account.account-created')}</span>
          <span>{createdAt}</span>
        </div>
      </div>
    </>
  )
}

type EditNameProps = {
  name: string
}

const EditName = (props: EditNameProps) => {
  const { name } = props
  const [open, setOpen] = useState(false)
  const t = useTranslations()

  const editNameFormSchema = z.object({
    name: z
      .string()
      .min(1, { message: t('error.name-cannot-be-empty') })
      .max(50, { message: t('error.name-too-long') })
  })

  const form = useForm<z.infer<typeof editNameFormSchema>>({
    resolver: zodResolver(editNameFormSchema),
    defaultValues: {
      name
    }
  })

  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser(() => {
    form.reset({ name: form.getValues('name') })
    setOpen(false)
    toast.success(t('account.edit-name-successfully'))
  })

  const onSubmit = (values: z.infer<typeof editNameFormSchema>) => {
    if (isUpdating) return
    updateUser({ name: values.name })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant='outline'>{t('account.edit-name')}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Form {...form}>
          <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('account.edit-name')}</AlertDialogTitle>
              <AlertDialogDescription>{t('account.edit-name-description')}</AlertDialogDescription>
            </AlertDialogHeader>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('account.display-name')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('account.display-name')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <Button type='submit'>{t('common.save')}</Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default Profile
