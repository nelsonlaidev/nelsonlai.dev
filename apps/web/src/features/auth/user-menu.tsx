import { authClient } from '@repo/auth/client'
import { Button } from '@repo/ui/components/button'
import { DialogTrigger } from '@repo/ui/components/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu'
import { Link } from '@tanstack/react-router'
import { LogOutIcon, ShieldIcon, UserCircleIcon } from 'lucide-react'
import { Skeleton } from 'skullet/react'

import { UserAvatar } from '@/components/user-avatar'
import { m } from '@/paraglide/messages'

import { signInDialogHandle } from './sign-in-dialog'
import { useSignOut } from './use-sign-out'

export function UserMenu() {
  const { data: session, isPending } = authClient.useSession()
  const { isSigningOut, signOut } = useSignOut()

  if (isPending || !session) {
    return (
      <Skeleton loading={isPending} label={m.common_aria_labels_loading()}>
        <DialogTrigger handle={signInDialogHandle} render={<Button variant='ghost' />}>
          {m.common_sign_in()}
        </DialogTrigger>
      </Skeleton>
    )
  }

  const { user } = session

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant='ghost' size='icon-lg' className='rounded-full' />}
        aria-label={m.common_labels_account()}
      >
        <UserAvatar id={user.id} name={user.name} image={user.image} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-40'>
        <DropdownMenuItem render={<Link to='/account' />}>
          <UserCircleIcon aria-hidden='true' />
          {m.common_labels_account()}
        </DropdownMenuItem>
        {user.role === 'admin' && (
          <DropdownMenuItem render={<Link to='/admin' />}>
            <ShieldIcon aria-hidden='true' />
            {m.common_labels_admin()}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isSigningOut}
          onClick={() => {
            void signOut()
          }}
        >
          <LogOutIcon aria-hidden='true' />
          {m.common_sign_out()}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
