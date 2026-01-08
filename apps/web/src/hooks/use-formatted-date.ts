import dayjs from 'dayjs'
import { type DateTimeFormatOptions, useFormatter } from 'next-intl'
import { useEffect, useState } from 'react'

type Options = {
  relative?: boolean
  formatOptions?: DateTimeFormatOptions
}

type DateInput = Date | string | number

export function useFormattedDate(date: DateInput, options: Options = {}): string | null {
  const {
    relative = false,
    formatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  } = options

  const format = useFormatter()
  const [formattedDate, setFormattedDate] = useState<string | null>(null)

  useEffect(() => {
    const now = new Date()
    const convertedDate = dayjs(date).toDate()

    if (relative) {
      const daysDiff = dayjs(now).diff(convertedDate, 'day')

      setFormattedDate(
        Math.abs(daysDiff) > 7 ? format.dateTime(convertedDate, formatOptions) : format.relativeTime(convertedDate, now)
      )
    } else {
      setFormattedDate(format.dateTime(convertedDate, formatOptions))
    }
  }, [date, relative, formatOptions, format])

  return formattedDate
}
