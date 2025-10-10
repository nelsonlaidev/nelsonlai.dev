import { localeLabels, routing, usePathname, useRouter } from '@repo/i18n/routing'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/select'
import { LanguagesIcon } from 'lucide-react'
import { type Locale, useLocale, useTranslations } from 'next-intl'
import { useTransition } from 'react'

const LocaleSwitcher = () => {
  const t = useTranslations()
  const currentLocale = useLocale()
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (locale: Locale) => {
    startTransition(() => {
      router.replace(pathname, { locale })
    })
  }

  return (
    <Select value={currentLocale} onValueChange={switchLanguage} disabled={isPending}>
      <SelectTrigger className='w-36' aria-label={t('layout.change-language')}>
        <div className='flex items-center gap-2'>
          <LanguagesIcon />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent side='top'>
        {routing.locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {localeLabels[locale]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default LocaleSwitcher
