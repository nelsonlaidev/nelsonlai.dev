'use client'

import { Button } from '@repo/ui/components/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@repo/ui/components/drawer'
import { Link } from '@repo/ui/components/link'
import { MenuIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { ACCOUNT_SIDEBAR_LINKS } from '@/config/links'

const AccountMobileNav = () => {
  const t = useTranslations()
  const [open, setOpen] = useState(false)

  const handleCloseDrawer = () => {
    setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant='outline' size='icon' className='size-10 md:hidden'>
          <MenuIcon className='size-4' />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className='sr-only'>
          <DrawerTitle>Drawer</DrawerTitle>
          <DrawerDescription>Displays the mobile navigation in drawer.</DrawerDescription>
        </DrawerHeader>
        <ul className='p-8'>
          {ACCOUNT_SIDEBAR_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={handleCloseDrawer} className='block py-2.5 text-muted-foreground'>
                {t(link.labelKey)}
              </Link>
            </li>
          ))}
        </ul>
      </DrawerContent>
    </Drawer>
  )
}

export default AccountMobileNav
