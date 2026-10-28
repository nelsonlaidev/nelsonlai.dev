import { Button } from '@repo/ui/components/button'
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/popover'
import { Link, useRouter } from '@tanstack/react-router'
import { MenuIcon, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { HEADER_LINKS } from '@/lib/navigation'
import { m } from '@/paraglide/messages'

export function MobileNav() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    return router.subscribe('onBeforeNavigate', () => {
      setOpen(false)
    })
  }, [open, router])

  return (
    <nav aria-label={m.nav_primary()} className='md:hidden'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={<Button variant='ghost' size='icon' />} aria-label={m.nav_toggle()}>
          {open ? <XIcon aria-hidden='true' /> : <MenuIcon aria-hidden='true' />}
        </PopoverTrigger>
        <PopoverContent
          align='end'
          alignOffset={-16}
          sideOffset={24}
          aria-label={m.nav_primary()}
          className='max-h-[calc(100dvh-7rem)] w-[calc(100vw-2rem)] overflow-y-auto border bg-background p-2 shadow-lg md:hidden'
        >
          <ul>
            {HEADER_LINKS.map((link) => (
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
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </nav>
  )
}
