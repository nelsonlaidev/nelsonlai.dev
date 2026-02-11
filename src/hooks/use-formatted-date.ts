import { type DateTimeFormatOptions, useFormatter, useNow } from 'next-intl'
import { useEffect, useState } from 'react'

type Options = {
  relative?: boolean
  threshold?: number
  formatName?: string
  formatOptions?: DateTimeFormatOptions
}

type DateInput = Date | string | number

export function useFormattedDate(date: DateInput, options: Options = {}): string | null {
  const { relative = false, threshold = 7, formatName = 'short', formatOptions } = options

  const format = useFormatter()
  const now = useNow()

  const [formattedDate, setFormattedDate] = useState<string | null>(null)

  useEffect(() => {
    const dateTime = new Date(date)
    const { timeZone } = Intl.DateTimeFormat().resolvedOptions()

    const formatOptionsWithTimeZone = {
      ...formatOptions,
      timeZone,
    }

    // Check if we should use relative time
    const useRelative = relative && Math.abs(now.getTime() - dateTime.getTime()) / (1000 * 60 * 60 * 24) <= threshold

    const result = useRelative
      ? format.relativeTime(dateTime, now)
      : format.dateTime(dateTime, formatName, formatOptionsWithTimeZone)

    setFormattedDate(result)
  }, [date, relative, threshold, formatOptions, format, now, formatName])

  return formattedDate
}
