'use client'

import { usePathname } from '@repo/i18n/routing'
import { Link } from '@repo/ui/components/link'
import { useTranslations } from 'next-intl'

import { HEADER_LINKS } from '@/config/links'

const Navbar = () => {
  const pathname = usePathname()
  const t = useTranslations()

  return (
    <nav className='hidden md:block'>
      <ul className='flex gap-2'>
        {HEADER_LINKS.map((link) => {
          const isActive = link.href === pathname

          return (
            <li key={link.key} className='relative flex items-center justify-center'>
              <Link
                className='rounded-sm px-3 py-2 text-sm font-medium transition-colors'
                href={link.href}
                variant={isActive ? undefined : 'muted'}
              >
                {t(link.labelKey)}
              </Link>
              {isActive && (
                <>
                  <div className='absolute bottom-0 left-1/2 h-px w-12 -translate-x-1/2 bg-nav-link-indicator' />
                  <div className='absolute bottom-0 left-1/2 size-2.5 -translate-x-1/2 rounded-[4px] bg-[rgb(255_122_151)] blur-sm dark:bg-[rgb(223_29_72)]' />
                </>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default Navbar
