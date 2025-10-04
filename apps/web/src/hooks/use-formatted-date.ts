import { type DateTimeFormatOptions, useFormatter } from '@repo/i18n/client'
import dayjs from 'dayjs'

type Options = {
  relative?: boolean
  formatOptions?: DateTimeFormatOptions
}

export const useFormattedDate = (date: Date | string | number, options: Options = {}) => {
  const {
    relative = false,
    formatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  } = options

  const format = useFormatter()
  const now = new Date()

  const convertedDate = dayjs(date).toDate()

  if (relative) {
    const daysDiff = dayjs(now).diff(convertedDate, 'day')

    return Math.abs(daysDiff) > 7
      ? format.dateTime(convertedDate, formatOptions)
      : format.relativeTime(convertedDate, now)
  } else {
    return format.dateTime(convertedDate, formatOptions)
  }
}
