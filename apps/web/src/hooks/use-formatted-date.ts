import type { DateTimeFormatOptions } from 'use-intl'

import { useEffect, useState } from 'react'
import { useFormatter, useNow } from 'use-intl'

type FormattedDateOptions = {
  relative?: boolean
  threshold?: number
  formatName?: string
  formatOptions?: DateTimeFormatOptions
}

type DateInput = Date | string | number

export function useFormattedDate(date: DateInput, options: FormattedDateOptions = {}): string | null {
  const { relative = false, threshold = 7, formatName = 'short', formatOptions } = options
  const format = useFormatter()
  const now = useNow()
  const [formattedDate, setFormattedDate] = useState<string | null>(null)

  useEffect(() => {
    const dateTime = new Date(date)
    const { timeZone } = Intl.DateTimeFormat().resolvedOptions()
    const useRelative = relative && Math.abs(now.getTime() - dateTime.getTime()) / (1000 * 60 * 60 * 24) <= threshold
    const result = useRelative
      ? format.relativeTime(dateTime, now)
      : format.dateTime(dateTime, formatName, { ...formatOptions, timeZone })

    // This state update must run after hydration to use the visitor's time zone
    // without mismatching the server and initial client render.
    // oxlint-disable-next-line @eslint-react/set-state-in-effect
    setFormattedDate(result)
  }, [date, relative, threshold, formatName, formatOptions, format, now])

  return formattedDate
}
