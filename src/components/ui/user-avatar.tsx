import { cn } from '@/utils/cn'
import { getDefaultImage } from '@/utils/get-default-image'
import { getInitials } from '@/utils/get-initials'

import { Avatar, AvatarFallback, AvatarImage } from './avatar'

type UserAvatarProps = React.ComponentProps<typeof Avatar> & {
  id: string
  name: string
  image?: string | null
}

export function UserAvatar(props: UserAvatarProps) {
  const { id, name, image, className, ...rest } = props

  return (
    <Avatar className={cn('@container', className)} {...rest}>
      <AvatarImage src={image ?? getDefaultImage(id)} alt={name} />
      <AvatarFallback className='text-[40cqi]'>{getInitials(name)}</AvatarFallback>
    </Avatar>
  )
}
