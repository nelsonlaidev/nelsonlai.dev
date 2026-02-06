'use client'

import { Command as CommandPrimitive } from 'cmdk'
import { CheckIcon, SearchIcon } from 'lucide-react'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { InputGroup, InputGroupAddon } from '@/components/ui/input-group'
import { cn } from '@/utils/cn'

type CommandProps = React.ComponentProps<typeof CommandPrimitive>

function Command(props: CommandProps) {
  const { className, ...rest } = props

  return (
    <CommandPrimitive
      data-slot='command'
      className={cn(
        'flex size-full flex-col overflow-hidden rounded-4xl bg-popover p-1 text-popover-foreground',
        className,
      )}
      {...rest}
    />
  )
}

type CommandDialogProps = Omit<React.ComponentProps<typeof Dialog>, 'children'> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
  children: React.ReactNode
}

function CommandDialog(props: CommandDialogProps) {
  const {
    title = 'Command Palette',
    description = 'Search for a command to run...',
    children,
    className,
    showCloseButton = false,
    ...rest
  } = props

  return (
    <Dialog {...rest}>
      <DialogHeader className='sr-only'>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn('top-1/3 translate-y-0 overflow-hidden rounded-4xl! p-0', className)}
        showCloseButton={showCloseButton}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}

type CommandInputProps = React.ComponentProps<typeof CommandPrimitive.Input>

function CommandInput(props: CommandInputProps) {
  const { className, ...rest } = props

  return (
    <div data-slot='command-input-wrapper' className='p-1 pb-0'>
      <InputGroup className='h-9 bg-input/30'>
        <CommandPrimitive.Input
          data-slot='command-input'
          className={cn('w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50', className)}
          {...rest}
        />
        <InputGroupAddon>
          <SearchIcon className='size-4 shrink-0 opacity-50' />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

type CommandListProps = React.ComponentProps<typeof CommandPrimitive.List>

function CommandList(props: CommandListProps) {
  const { className, ...rest } = props

  return (
    <CommandPrimitive.List
      data-slot='command-list'
      className={cn('no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none', className)}
      {...rest}
    />
  )
}

type CommandEmptyProps = React.ComponentProps<typeof CommandPrimitive.Empty>

function CommandEmpty(props: CommandEmptyProps) {
  const { className, ...rest } = props

  return (
    <CommandPrimitive.Empty data-slot='command-empty' className={cn('py-6 text-center text-sm', className)} {...rest} />
  )
}

type CommandGroupProps = React.ComponentProps<typeof CommandPrimitive.Group>

function CommandGroup(props: CommandGroupProps) {
  const { className, ...rest } = props

  return (
    <CommandPrimitive.Group
      data-slot='command-group'
      className={cn(
        'overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:py-2 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground',
        className,
      )}
      {...rest}
    />
  )
}

type CommandSeparatorProps = React.ComponentProps<typeof CommandPrimitive.Separator>

function CommandSeparator(props: CommandSeparatorProps) {
  const { className, ...rest } = props

  return (
    <CommandPrimitive.Separator
      data-slot='command-separator'
      className={cn('my-1 h-px bg-border/50', className)}
      {...rest}
    />
  )
}

type CommandItemProps = React.ComponentProps<typeof CommandPrimitive.Item>

function CommandItem(props: CommandItemProps) {
  const { className, children, ...rest } = props

  return (
    <CommandPrimitive.Item
      data-slot='command-item'
      className={cn(
        "group/command-item relative flex cursor-default items-center gap-2 rounded-lg px-3 py-2 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-2xl data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-muted data-selected:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-selected:*:[svg]:text-foreground",
        className,
      )}
      {...rest}
    >
      {children}
      <CheckIcon className='ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100' />
    </CommandPrimitive.Item>
  )
}

type CommandShortcutProps = React.ComponentProps<'span'>

function CommandShortcut(props: CommandShortcutProps) {
  const { className, ...rest } = props

  return (
    <span
      data-slot='command-shortcut'
      className={cn(
        'ml-auto text-xs tracking-widest text-muted-foreground group-data-selected/command-item:text-foreground',
        className,
      )}
      {...rest}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
}
