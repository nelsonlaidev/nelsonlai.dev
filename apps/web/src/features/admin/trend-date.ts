export function formatTrendDate(day: string, locale: string, options: Intl.DateTimeFormatOptions) {
  // API buckets are calendar days in the requested zone, not instants to convert again.
  return new Date(day).toLocaleDateString(locale, { ...options, timeZone: 'UTC' })
}
