'use client'

import { useTranslations } from 'next-intl'

import { Link } from '@/components/ui/link'
import { HEADER_LINKS } from '@/constants/navigation'
import { usePathname } from '@/i18n/routing'

export function Navbar() {
  const pathname = usePathname()
  const t = useTranslations()

  return (
    <nav className='hidden md:block'>
      <ul className='flex items-center gap-2'>
        {HEADER_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              data-active={pathname === link.href}
              className='px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-active:text-foreground'
            >
              {t(link.labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
