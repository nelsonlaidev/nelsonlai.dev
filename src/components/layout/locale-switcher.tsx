import { LanguagesIcon } from 'lucide-react'
import { type Locale, useLocale, useTranslations } from 'next-intl'
import { useTransition } from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { localeLabels, routing, usePathname, useRouter } from '@/i18n/routing'

const items = routing.locales.map((locale) => ({
  label: localeLabels[locale],
  value: locale,
}))

function LocaleSwitcher() {
  const t = useTranslations()
  const currentLocale = useLocale()
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()

  function switchLanguage(locale: Locale) {
    startTransition(() => {
      router.replace(pathname, { locale })
    })
  }

  return (
    <Select
      items={items}
      value={currentLocale}
      onValueChange={(value) => {
        if (value) switchLanguage(value)
      }}
      disabled={isPending}
    >
      <SelectTrigger className='w-36' aria-label={t('layout.change-language')}>
        <div className='flex items-center gap-2'>
          <LanguagesIcon />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent side='top'>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default LocaleSwitcher
