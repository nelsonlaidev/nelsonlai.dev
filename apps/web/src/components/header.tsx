import { Button } from '@repo/ui/components/button'
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/popover'
import { Link, useRouter } from '@tanstack/react-router'
import { cn } from 'cn'
import { useEffect, useState } from 'react'

import { HEADER_LINKS } from '@/lib/navigation'
import { m } from '@/paraglide/messages'
import { CommandMenu } from '@/routes/_main/-components/command-menu'
import { SkipNav } from '@/routes/_main/-components/skip-nav'

import { OceanBrand } from './brand'

export function Header() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(
    () =>
      router.subscribe('onBeforeNavigate', () => {
        setOpen(false)
      }),
    [router],
  )

  return (
    <>
      <SkipNav />
      <header
        className={cn(
          'absolute inset-x-0 top-0 z-40 flex items-center justify-between gap-2.5 py-6 pr-[max(16px,env(safe-area-inset-right))] pl-[max(16px,env(safe-area-inset-left))] md:gap-8 md:px-[5.5%] md:py-9',
          open && 'bg-popover/95',
        )}
      >
        <Link to='/' aria-label={`Seafold, ${m.nav_home()}`}>
          <OceanBrand />
        </Link>
        <nav aria-label={m.nav_primary()} className='hidden lg:block'>
          <ul className='flex items-center gap-6'>
            {HEADER_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className='relative inline-flex items-center text-sm font-medium text-link hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:after:absolute aria-[current=page]:after:bottom-0.5 aria-[current=page]:after:left-1/2 aria-[current=page]:after:size-0.75 aria-[current=page]:after:-translate-x-1/2 aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-primary'
                >
                  {link.label()}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className='flex items-center gap-2'>
          <CommandMenu />
          <nav aria-label={m.nav_primary()} className='lg:hidden'>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                render={
                  <Button
                    variant='ghost'
                    className='gap-3 p-0 text-sm font-normal hover:bg-transparent hover:text-foreground aria-expanded:bg-transparent aria-expanded:text-foreground'
                  />
                }
                aria-label={m.nav_toggle()}
              >
                {open ? m.common_labels_close() : m.nav_explore()}
                <span className='text-lg text-primary' aria-hidden='true'>
                  {open ? '−' : '+'}
                </span>
              </PopoverTrigger>
              <PopoverContent
                collisionPadding={0}
                align='end'
                alignOffset={-16}
                sideOffset={24}
                aria-label={m.nav_primary()}
                className='max-h-[calc(100dvh-8rem)] w-screen overflow-y-auto rounded-none border-b bg-popover/95 pt-4 pr-[max(16px,env(safe-area-inset-right))] pb-9 pl-[max(16px,env(safe-area-inset-left))] text-foreground shadow-none ring-0 backdrop-blur-xl lg:hidden'
              >
                <ul>
                  <li>
                    <Link
                      to='/'
                      className='flex min-h-16 items-center justify-between border-b py-4 text-xl tracking-tight'
                    >
                      {m.nav_home()}
                      <span className='text-sm text-muted-foreground'>00</span>
                    </Link>
                  </li>
                  {HEADER_LINKS.map((link, index) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className='flex min-h-16 items-center justify-between border-b py-4 text-xl tracking-tight'
                      >
                        {link.label()}
                        <span className='text-sm text-muted-foreground'>{String(index + 1).padStart(2, '0')}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          </nav>
        </div>
      </header>
    </>
  )
}
