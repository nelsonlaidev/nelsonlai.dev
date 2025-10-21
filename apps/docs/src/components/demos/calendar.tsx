'use client'

import { useState } from 'react'

import { Calendar } from '../ui/calendar'

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
