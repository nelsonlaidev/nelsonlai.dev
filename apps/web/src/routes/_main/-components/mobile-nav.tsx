import { Button } from '@repo/ui/components/button'
import { Link, useRouter } from '@tanstack/react-router'
import { MenuIcon, XIcon } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

import { HEADER_LINKS } from '@/lib/navigation'
import { m } from '@/paraglide/messages'

export function MobileNav() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const navRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const media = globalThis.matchMedia('(min-width: 48rem)')
    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false)
    }
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      event.preventDefault()
      setOpen(false)
      triggerRef.current?.focus()
    }
    const unsubscribe = router.subscribe('onBeforeNavigate', () => {
      setOpen(false)
      if (navRef.current?.contains(document.activeElement)) triggerRef.current?.focus()
    })

    media.addEventListener('change', handleBreakpointChange)
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      media.removeEventListener('change', handleBreakpointChange)
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      unsubscribe()
    }
  }, [open, router])

  return (
    <nav
      ref={navRef}
      aria-label={m.nav_primary()}
      className='md:hidden'
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <Button
        ref={triggerRef}
        variant='ghost'
        size='icon'
        aria-label={m.nav_toggle()}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          setOpen(!open)
        }}
      >
        {open ? <XIcon aria-hidden='true' /> : <MenuIcon aria-hidden='true' />}
      </Button>
      <ul
        id={panelId}
        hidden={!open}
        className='absolute inset-x-4 top-full mt-3 max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-2xl border bg-background/95 p-2 shadow-lg backdrop-blur-md'
      >
        {HEADER_LINKS.map((link) => {
          return (
            <li key={link.to}>
              <Link
                to={link.to}
                activeProps={{ 'data-active': 'true' }}
                className='flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring data-active:bg-accent data-active:text-accent-foreground'
              >
                <link.icon aria-hidden='true' className='size-4 shrink-0' />
                {link.label()}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
