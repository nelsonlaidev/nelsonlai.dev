import { useQuery } from '@tanstack/react-query'
import { ClockIcon } from 'lucide-react'

import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

export function CodingHours() {
  const { data, isError } = useQuery(orpc.wakatime.stats.queryOptions({ refetchOnWindowFocus: false }))

  let content = '--'

  if (data) {
    content = `${data.hours} hrs`
  } else if (isError) {
    content = m.common_error()
  }

  return (
    <div className='flex flex-col gap-6 rounded-2xl p-4 shadow-feature-card lg:p-6'>
      <div className='flex items-center gap-2'>
        <ClockIcon className='size-4.5' />
        <h2 className='text-sm'>{m.homepage_about_me_coding_hours()}</h2>
      </div>
      <div className='flex grow items-center justify-center text-4xl font-semibold'>{content}</div>
    </div>
  )
}
