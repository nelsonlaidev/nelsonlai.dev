'use client'

import { ClockIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useWakatimeStat } from '@/hooks/queries/stat.query'

const CodingHours = () => {
  const { isSuccess, isLoading, isError, data } = useWakatimeStat()
  const t = useTranslations()

  return (
    <div className='flex flex-col gap-6 rounded-xl p-4 shadow-feature-card lg:p-6'>
      <div className='flex items-center gap-2'>
        <ClockIcon className='size-4.5' />
        <h2 className='text-sm'>{t('homepage.about-me.coding-hours')}</h2>
      </div>
      <div className='flex grow items-center justify-center text-4xl font-semibold'>
        {isSuccess && `${data.hours} hrs`}
        {isLoading && '--'}
        {isError && t('common.error')}
      </div>
    </div>
  )
}

export default CodingHours
