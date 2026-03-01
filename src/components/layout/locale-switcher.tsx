import type { Locale } from 'next-intl'

import { LanguagesIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useTransition } from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LOCALE_ITEMS, usePathname, useRouter } from '@/i18n/routing'

export function LocaleSwitcher() {
  const t = useTranslations()
  const locale = useLocale()
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()

  function handleLocaleChange(value: Locale | null) {
    if (!value) return

    startTransition(() => {
      router.replace(pathname, { locale: value })
    })
  }

  return (
    <Select items={LOCALE_ITEMS} value={locale} onValueChange={handleLocaleChange} disabled={isPending}>
      <SelectTrigger className='w-36' aria-label={t('layout.change-language')}>
        <LanguagesIcon />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LOCALE_ITEMS.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
