import dayjs from 'dayjs'
import { type DateTimeFormatOptions, useFormatter } from 'next-intl'

type Options = {
  relative?: boolean
  formatOptions?: DateTimeFormatOptions
}

type DateInput = Date | string | number

export function useFormattedDate(date: DateInput, options?: Options): string
export function useFormattedDate(date?: DateInput, options?: Options): string | null
export function useFormattedDate(date?: DateInput, options: Options = {}): string | null {
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
}
