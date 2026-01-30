'use client'

import { useTranslations } from 'next-intl'

import { Skeleton } from '@/components/ui/skeleton'
import { useGetSettings } from '@/hooks/queries/settings.query'

import SettingsForm from './settings-form'

function Settings() {
  const t = useTranslations()
  const { data, isSuccess, isError, isLoading } = useGetSettings()

  return (
    <>
      {isLoading && <Skeleton className='h-80 w-full rounded-xl' />}
      {isError && t('error.failed-to-load-settings')}
      {isSuccess && <SettingsForm settings={data} />}
    </>
  )
}

export default Settings
