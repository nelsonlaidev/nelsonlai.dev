import { Button } from '@repo/ui/components/button'
import { Link, useRouter } from '@tanstack/react-router'
import { MenuIcon, XIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { UserMenu } from '@/features/auth/user-menu'
import { HEADER_LINKS } from '@/lib/navigation'
import { m } from '@/paraglide/messages'
import { SkipNav } from '@/routes/_main/-components/skip-nav'

import { SiteLogo } from './site-logo'

const mobileLinks = [{ to: '/', label: m.nav_home }, ...HEADER_LINKS] as const

export function Header() {
  const [open, setOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!open) return

    function close() {
      setOpen(false)
    }

    function dismissOutside(event: Event) {
      const target = event.target
      if (target instanceof Node && !navRef.current?.contains(target) && !toggleRef.current?.contains(target)) close()
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      event.preventDefault()
      toggleRef.current?.focus()
      close()
    }

    const desktop = globalThis.matchMedia('(min-width: 64rem)')
    const unsubscribe = router.subscribe('onBeforeNavigate', close)
    const controller = new AbortController()

    desktop.addEventListener('change', close, { signal: controller.signal })
    document.addEventListener('pointerdown', dismissOutside, { signal: controller.signal })
    document.addEventListener('focusin', dismissOutside, { signal: controller.signal })
    document.addEventListener('keydown', handleKeyDown, { signal: controller.signal })

    return () => {
      unsubscribe()
      controller.abort()
    }
  }, [open, router])

  return (
    <>
      <SkipNav />
      <header className='pointer-events-none absolute inset-x-0 top-0 z-40 grid max-h-dvh grid-cols-1 grid-rows-[auto_minmax(0,1fr)]'>
        <div className='pointer-events-auto relative z-10 col-start-1 row-start-1 py-6 pr-[max(16px,env(safe-area-inset-right))] pl-[max(16px,env(safe-area-inset-left))] sm:px-[8%] md:py-9 xl:px-[10%]'>
          <div className='mx-auto flex max-w-7xl items-center justify-between gap-2.5 md:gap-8'>
            <Link to='/' aria-label={`Seafold, ${m.nav_home()}`}>
              <SiteLogo />
            </Link>
            <nav aria-label={m.nav_primary()} className='hidden lg:block'>
              <ul className='flex items-center gap-6'>
                {HEADER_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className='relative inline-flex items-center text-sm font-medium text-link hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:after:absolute aria-[current=page]:after:top-full aria-[current=page]:after:left-1/2 aria-[current=page]:after:mt-2 aria-[current=page]:after:size-0.75 aria-[current=page]:after:-translate-x-1/2 aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-primary'
                    >
                      {link.label()}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className='flex items-center gap-2'>
              <UserMenu />
              <Button
                ref={toggleRef}
                variant='ghost'
                size='icon-lg'
                className='lg:hidden'
                aria-label={m.nav_toggle()}
                aria-controls='mobile-navigation'
                aria-expanded={open}
                onClick={() => {
                  setOpen(!open)
                }}
              >
                {open ? <XIcon aria-hidden='true' /> : <MenuIcon aria-hidden='true' />}
              </Button>
            </div>
          </div>
        </div>
        <nav
          ref={navRef}
          id='mobile-navigation'
          aria-label={m.nav_primary()}
          inert={!open}
          className='pointer-events-auto col-start-1 row-span-2 row-start-1 grid grid-rows-subgrid bg-popover transition-[opacity,visibility] duration-260 ease-in-out inert:pointer-events-none inert:invisible inert:opacity-0 motion-reduce:transition-none lg:hidden'
        >
          <div className='row-start-2 overflow-y-auto overscroll-contain border-b pt-4 pr-[max(16px,env(safe-area-inset-right))] pb-9 pl-[max(16px,env(safe-area-inset-left))] sm:px-[8%]'>
            <ul className='transition-transform duration-260 ease-in-out inert:translate-y-1.5 motion-reduce:transition-none'>
              {mobileLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className='flex min-h-16 items-center border-b py-4 text-xl'>
                    {link.label()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>
    </>
  )
}
