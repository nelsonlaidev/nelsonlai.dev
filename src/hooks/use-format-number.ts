import { useLocale } from 'next-intl'

export function useFormatNumber(options?: Intl.NumberFormatOptions) {
  const locale = useLocale()
  const formatter = new Intl.NumberFormat(locale, {
    notation: 'compact',
    ...options,
  })

  return (number: number) => formatter.format(number)
}
