import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@repo/ui/components/input-group'
import { PlusIcon, SearchIcon } from 'lucide-react'

const meta = {
  title: 'Actions and forms/Input group',
  parameters: {
    docs: {
      description: {
        component:
          'Import the InputGroup* parts from @repo/ui/components/input-group. Addons support inline-start/end and block-start/end. Clicking an addon focuses its input. Supply an accessible name and keep embedded buttons separate from the field label.',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj

export const InlineAddons: Story = {
  render: () => (
    <div className='max-w-md space-y-4'>
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon aria-hidden='true' />
        </InputGroupAddon>
        <InputGroupInput aria-label='Search components' placeholder='Search components' />
        <InputGroupAddon align='inline-end'>
          <InputGroupText>⌘ K</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label='Local address' defaultValue='example.invalid' />
        <InputGroupAddon align='inline-end'>
          <InputGroupButton>Copy</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput aria-label='Disabled search' disabled placeholder='Disabled' />
        <InputGroupAddon>
          <SearchIcon aria-hidden='true' />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput aria-label='Invalid input' aria-invalid='true' defaultValue='Invalid value' />
      </InputGroup>
    </div>
  ),
}

export const BlockAddons: Story = {
  render: () => (
    <div className='max-w-md space-y-4'>
      <InputGroup>
        <InputGroupAddon align='block-start' className='border-b'>
          <InputGroupText>Local draft</InputGroupText>
        </InputGroupAddon>
        <InputGroupTextarea aria-label='Draft text' placeholder='Write a longer draft…' />
        <InputGroupAddon align='block-end' className='border-t'>
          <InputGroupText>Plain text</InputGroupText>
          <InputGroupButton className='ml-auto' variant='outline' size='sm'>
            Save locally
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <div className='flex gap-3'>
        {(['xs', 'sm', 'icon-xs', 'icon-sm'] as const).map((size) => (
          <InputGroupButton key={size} size={size} aria-label={`Add item ${size}`}>
            <PlusIcon aria-hidden='true' />
            {!size.startsWith('icon') && size}
          </InputGroupButton>
        ))}
      </div>
    </div>
  ),
}
