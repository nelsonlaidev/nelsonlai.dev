'use client'

import { Link, usePathname } from '@repo/i18n/routing'
import { cn } from '@repo/ui/utils/cn'
import { useTranslations } from 'next-intl'

import { ACCOUNT_SIDEBAR_LINKS } from '@/config/links'

const AccountSidebar = () => {
  const t = useTranslations()
  const pathname = usePathname()

  return (
    <div className='hidden min-w-50 md:block'>
      <ul className='flex flex-col gap-1'>
        {ACCOUNT_SIDEBAR_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                'block rounded-md px-3 py-2 transition-colors hover:bg-accent',
                pathname === link.href ? 'text-foreground' : 'text-muted-foreground'
              )}
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
