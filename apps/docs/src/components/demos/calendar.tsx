'use client'

import { Calendar } from '@repo/ui/components/calendar'
import { useState } from 'react'

const CalendarDemo = () => {
  const [date, setDate] = useState<Date | undefined>(() => new Date())

  return (
    <Calendar
      mode='single'
      selected={date}
      onSelect={setDate}
      className='rounded-md border shadow-sm'
      captionLayout='dropdown'
    />
  )
}

export default CalendarDemo
