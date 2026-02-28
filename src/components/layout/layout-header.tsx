'use client'

import { useTranslations } from 'next-intl'
import { useLayoutEffect, useRef } from 'react'

import { CommandMenu } from '@/components/command-menu'
import { Link } from '@/components/ui/link'
import { Logo } from '@/components/ui/logo'

import { MobileNav } from './mobile-nav'
import { Navbar } from './navbar'
import { SkipNav } from './skip-nav'
import { ThemeSwitcher } from './theme-switcher'

const SCROLL_THRESHOLD = 100

export function LayoutHeader() {
  const headerRef = useRef<HTMLElement>(null)
  const rafRef = useRef<number | null>(null)
  const t = useTranslations()

  useLayoutEffect(() => {
    const handleScroll = () => {
      if (rafRef.current !== null) return

      rafRef.current = requestAnimationFrame(() => {
        if (headerRef.current) {
          const isScrolled = window.scrollY > SCROLL_THRESHOLD

          const currentScrolled = headerRef.current.dataset.scrolled === 'true'

          if (isScrolled !== currentScrolled) {
            headerRef.current.dataset.scrolled = String(isScrolled)
          }
        }

        rafRef.current = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return (
    <header
      ref={headerRef}
      className='fixed inset-x-0 top-4 z-40 mx-auto flex h-15 max-w-5xl items-center justify-between rounded-2xl bg-background/30 px-8 shadow-xs backdrop-blur-md transition-colors data-[scrolled=true]:bg-background/80'
    >
      <SkipNav />
      <Link href='/' aria-label={t('common.labels.home')}>
        <Logo width={20} aria-hidden='true' />
      </Link>
      <div className='flex items-center gap-2'>
        <Navbar />
        <ThemeSwitcher />
        <CommandMenu />
        <MobileNav />
      </div>
    </header>
  )
}
