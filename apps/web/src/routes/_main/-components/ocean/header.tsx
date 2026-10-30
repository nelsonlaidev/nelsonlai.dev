import { Button } from '@repo/ui/components/button'
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/popover'
import { Link, useRouter } from '@tanstack/react-router'
import { cn } from 'cn'
import { useEffect, useState } from 'react'

import { HEADER_LINKS } from '@/lib/navigation'
import { m } from '@/paraglide/messages'

import { CommandMenu } from '../command-menu'
import { SkipNav } from '../skip-nav'
import { OceanBrand } from './brand'

const ORDER = ['/projects', '/blog', '/about', '/guestbook', '/uses', '/dashboard']
const LINKS = HEADER_LINKS.toSorted((a, b) => ORDER.indexOf(a.to) - ORDER.indexOf(b.to))

export function OceanHeader() {
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
          'absolute inset-x-0 top-0 z-40 flex items-center justify-between gap-2.5 py-6 pr-[max(16px,env(safe-area-inset-right))] pl-[max(16px,env(safe-area-inset-left))] min-[701px]:gap-7.5 min-[701px]:px-[5.5%] min-[701px]:py-8.75',
          open && 'bg-[#092d39f5]',
        )}
      >
        <Link to='/' aria-label={`Seafold, ${m.nav_home()}`}>
          <OceanBrand />
        </Link>
        <nav aria-label={m.nav_primary()} className='hidden min-[1001px]:block'>
          <ul className='flex items-center gap-6'>
            {LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className='relative inline-flex min-h-11 items-center text-sm font-medium text-[#c5d9d0] hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:after:absolute aria-[current=page]:after:bottom-0.5 aria-[current=page]:after:left-[calc(50%-2px)] aria-[current=page]:after:size-0.75 aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-[#d4e9cb]'
                >
                  {link.label()}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className='flex items-center gap-2'>
          <CommandMenu />
          <nav aria-label={m.nav_primary()} className='min-[1001px]:hidden'>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                render={
                  <Button
                    variant='ghost'
                    className='min-h-11 gap-3 p-0 text-sm font-normal hover:bg-transparent hover:text-foreground aria-expanded:bg-transparent aria-expanded:text-foreground dark:hover:bg-transparent'
                  />
                }
                aria-label={m.nav_toggle()}
              >
                {open ? m.common_labels_close() : m.ocean_explore()}
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
                className='max-h-[calc(100dvh-8rem)] w-screen overflow-y-auto rounded-none border-b bg-[#092d39f5] pt-4 pr-[max(16px,env(safe-area-inset-right))] pb-9 pl-[max(16px,env(safe-area-inset-left))] text-foreground shadow-none ring-0 backdrop-blur-xl min-[1001px]:hidden'
              >
                <ul>
                  <li>
                    <Link
                      to='/'
                      className='flex min-h-15 items-center justify-between border-b py-4 text-xl tracking-tight'
                    >
                      {m.nav_home()}
                      <span className='text-sm text-muted-foreground'>00</span>
                    </Link>
                  </li>
                  {LINKS.map((link, index) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className='flex min-h-15 items-center justify-between border-b py-4 text-xl tracking-tight'
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
