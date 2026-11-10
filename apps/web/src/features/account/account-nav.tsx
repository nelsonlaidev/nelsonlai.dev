import { Button } from '@repo/ui/components/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@repo/ui/components/drawer'
import { Link } from '@tanstack/react-router'
import { MenuIcon } from 'lucide-react'
import { useState } from 'react'

import { ACCOUNT_LINKS } from '@/lib/navigation'
import { m } from '@/paraglide/messages'

export function AccountMobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        render={<Button variant='outline' size='icon' className='size-11 md:hidden' />}
        aria-label={m.account_open_navigation_menu()}
      >
        <MenuIcon aria-hidden='true' />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className='sr-only'>
          <DrawerTitle>{m.account_mobile_nav_title()}</DrawerTitle>
          <DrawerDescription>{m.account_mobile_nav_description()}</DrawerDescription>
        </DrawerHeader>
        <ul className='p-8'>
          {ACCOUNT_LINKS.map((link) => (
            <li key={link.to}>
              <DrawerClose
                nativeButton={false}
                render={<Link to={link.to} activeOptions={{ exact: true }} />}
                className='block rounded-md px-3 py-2.5 text-muted-foreground transition-colors aria-[current=page]:bg-accent aria-[current=page]:text-foreground'
              >
                {link.label()}
              </DrawerClose>
            </li>
          ))}
        </ul>
      </DrawerContent>
    </Drawer>
  )
}

export function AccountSidebar() {
  return (
    <nav aria-label={m.common_labels_account()} className='hidden w-50 shrink-0 md:block'>
      <ul className='space-y-1'>
        {ACCOUNT_LINKS.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              activeOptions={{ exact: true }}
              className='block rounded-md border border-transparent px-3 py-2.5 text-muted-foreground transition-colors hover:bg-accent aria-[current=page]:border-border aria-[current=page]:bg-accent aria-[current=page]:text-foreground'
            >
              {link.label()}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
