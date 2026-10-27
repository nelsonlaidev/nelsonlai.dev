import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar'
import { getInitials } from '@repo/utils'
import { cn } from 'cn'

type UserAvatarProps = React.ComponentProps<typeof Avatar> & {
  id: string
  name: string
  image?: string | null
}

export function UserAvatar(props: UserAvatarProps) {
  const { id, name, image, className, ...rest } = props
  const initials = getInitials(name)

  return (
    <Avatar className={cn('@container', className)} {...rest}>
      <AvatarImage
        src={image ?? `/api/avatar/${encodeURIComponent(id)}.webp?text=${encodeURIComponent(initials)}`}
        alt={name}
      />
      <AvatarFallback className='text-[40cqi]'>{initials}</AvatarFallback>
    </Avatar>
  )
}
