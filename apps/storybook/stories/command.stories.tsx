import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@repo/ui/components/button'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@repo/ui/components/command'
import { DialogTrigger } from '@repo/ui/components/dialog'
import { useState } from 'react'

const meta = {
  title: 'Overlays and feedback/Command',
  parameters: {
    docs: {
      description: {
        component:
          'Import the Command* parts from @repo/ui/components/command. Built on cmdk. Type to filter, use arrows and Enter to select, or type an unmatched query for the empty state. CommandDialog gets default accessible labels from UIProvider.',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj

type CommandsProps = {
  onSelect: (value: string) => void
}

function Commands(props: CommandsProps) {
  const { onSelect } = props

  return (
    <Command className='max-w-md border'>
      <CommandInput placeholder='Find a local command…' aria-label='Search local commands' />
      <CommandList>
        <CommandEmpty>No commands found.</CommandEmpty>
        <CommandGroup heading='Editing'>
          <CommandItem
            onSelect={() => {
              onSelect('New draft')
            }}
          >
            New draft<CommandShortcut>⌘ N</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              onSelect('Copy draft')
            }}
          >
            Copy draft
          </CommandItem>
          <CommandItem disabled>Disabled command</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading='View'>
          <CommandItem
            onSelect={() => {
              onSelect('Show details')
            }}
          >
            Show details
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

function InlineExample() {
  const [selected, setSelected] = useState('none')

  return (
    <div className='space-y-4'>
      <Commands onSelect={setSelected} />
      <output>Selected: {selected}</output>
    </div>
  )
}

function DialogExample() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState('none')

  return (
    <div className='space-y-4'>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        showCloseButton
        trigger={<DialogTrigger render={<Button />}>Open command dialog</DialogTrigger>}
      >
        <Commands
          onSelect={(value) => {
            setSelected(value)
            setOpen(false)
          }}
        />
      </CommandDialog>
      <output>Selected: {selected}</output>
    </div>
  )
}

export const Inline: Story = {
  render: () => <InlineExample />,
}

export const InDialog: Story = {
  render: () => <DialogExample />,
}
