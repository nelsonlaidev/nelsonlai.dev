'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'

import CommandMenu from '@/components/command-menu'
import { Link } from '@/components/ui/link'
import { Logo } from '@/components/ui/logo'
import { IS_SERVER } from '@/lib/constants'

import MobileNav from './mobile-nav'
import Navbar from './navbar'
import ThemeSwitcher from './theme-switcher'

function LayoutHeader() {
  const headerRef = useRef<HTMLElement>(null)
  const rafRef = useRef<number | null>(null)
  const t = useTranslations()

  useEffect(() => {
    if (IS_SERVER) return

    const headerEl = headerRef.current
    if (!headerEl) return

    const currHeaderEl = headerEl

    function setScrolled() {
      const scrolled = window.scrollY > 100

      currHeaderEl.dataset.scrolled = scrolled ? 'true' : 'false'
    }

    function handleScroll() {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(setScrolled)
    }

    setScrolled()

    document.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header
      ref={headerRef}
      className='fixed inset-x-0 top-4 z-40 mx-auto flex h-15 max-w-5xl items-center justify-between rounded-2xl bg-background/30 px-8 shadow-xs saturate-100 backdrop-blur-md transition-colors data-[scrolled=true]:bg-background/80'
    >
      <Link
        href='#skip-nav'
        className='fixed top-4 left-4 -translate-y-20 rounded-4xl border bg-background px-3 py-2 font-medium shadow-xs transition-transform focus-visible:translate-y-0 focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2'
      >
        <span>{t('layout.skip-to-main-content')}</span>
      </Link>
      <Link href='/' className='flex items-center justify-center gap-1' aria-label={t('common.labels.home')}>
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

export default LayoutHeader
