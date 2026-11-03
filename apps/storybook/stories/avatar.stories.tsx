import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@repo/ui/components/avatar'
import { CheckIcon } from 'lucide-react'

const meta = {
  title: 'Data and display/Avatar',
  parameters: {
    docs: {
      description: {
        component:
          'Import the Avatar* parts from @repo/ui/components/avatar. Provide meaningful image alt text or initials. A failed image reveals the fallback. Group counts support the surrounding avatar size.',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj

export const SizesAndFallbacks: Story = {
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
}

export const Group: Story = {
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
}
