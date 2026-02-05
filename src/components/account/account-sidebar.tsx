'use client'

import { useTranslations } from 'next-intl'

import { ACCOUNT_SIDEBAR_LINKS } from '@/config/links'
import { Link, usePathname } from '@/i18n/routing'

function AccountSidebar() {
  const t = useTranslations()
  const pathname = usePathname()

  return (
    <div className='hidden min-w-50 md:block'>
      <ul className='flex flex-col gap-1'>
        {ACCOUNT_SIDEBAR_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              data-active={pathname === link.href}
              className='block rounded-xl px-3 py-2 text-muted-foreground transition-colors hover:bg-accent data-active:text-foreground'
            >
              {t(link.labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AccountSidebar
