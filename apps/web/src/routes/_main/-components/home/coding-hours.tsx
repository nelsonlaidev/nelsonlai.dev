import { ClockIcon } from 'lucide-react'

import { useWakatimeStats } from '@/features/wakatime/use-wakatime'
import { m } from '@/paraglide/messages'

export function CodingHours() {
  const { data, isSuccess, isLoading, isError } = useWakatimeStats()

  return (
    <div className='flex flex-col gap-6 rounded-2xl p-4 shadow-feature-card lg:p-6'>
      <div className='flex items-center gap-2'>
        <ClockIcon className='size-4.5' />
        <h2 className='text-sm'>{m.homepage_about_me_coding_hours()}</h2>
      </div>
      <div className='flex grow items-center justify-center text-4xl font-semibold'>
        {isSuccess && `${data.hours} hrs`}
        {isLoading && '--'}
        {isError && m.common_error()}
      </div>
    </div>
  )
}
