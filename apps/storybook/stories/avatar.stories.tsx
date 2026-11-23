import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@repo/ui/components/avatar'
import { CheckIcon } from 'lucide-react'

import preview from '../.storybook/preview'

const meta = preview.meta({
  title: 'Components/Avatar',
})

export const SizesAndFallbacks = meta.story({
  render: () => (
    <div className='flex flex-wrap items-center gap-6'>
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarImage src='/reef.svg' alt='Reef illustration' />
          <AvatarFallback>SF</AvatarFallback>
          <AvatarBadge>
            <CheckIcon aria-hidden='true' />
          </AvatarBadge>
        </Avatar>
      ))}
      <Avatar>
        <AvatarImage src='/missing-avatar.png' alt='Unavailable portrait' />
        <AvatarFallback>NL</AvatarFallback>
      </Avatar>
    </div>
  ),
})

export const Group = meta.story({
  render: () => (
    <AvatarGroup>
      {['NL', 'SF', 'UI'].map((initials) => (
        <Avatar key={initials} size='lg'>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
  ),
})
