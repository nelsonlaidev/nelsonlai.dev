import dayjs from 'dayjs'
import { type DateTimeFormatOptions, useFormatter } from 'next-intl'

type Options = {
  relative?: boolean
  formatOptions?: DateTimeFormatOptions
}

type UseFormattedDate = {
  (date: Date | string | number, options?: Options): string
  (date?: Date | string | number, options?: Options): string | null
}

export const useFormattedDate = ((date, options = {}) => {
  const {
    relative = false,
    formatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  } = options

  const format = useFormatter()

  if (!date) return null

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
}) as UseFormattedDate
