'use client'

import { cva, type VariantProps } from 'cva'

import { cn } from '../utils/cn'

import { Button } from './button'
import { Input } from './input'
import { Textarea } from './textarea'

type InputGroupProps = React.ComponentProps<'div'>

const InputGroup = (props: InputGroupProps) => {
  const { className, ...rest } = props

  return (
    <div
      data-slot='input-group'
      role='group'
      className={cn(
        'group/input-group relative flex w-full items-center rounded-md border border-input shadow-xs transition-[color,box-shadow] outline-none',
        'dark:bg-input/30',
        'h-9 min-w-0',
        'has-[>textarea]:h-auto',

        // Variants based on alignment.
        'has-[>[data-align=inline-start]]:[&>input]:pl-2',
        'has-[>[data-align=inline-end]]:[&>input]:pr-2',
        'has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3',
        'has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3',

        // Focus state.
        'has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50',

        // Error state.
        'dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40',
        'has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-destructive/20',

        className
      )}
      {...rest}
    />
  )
}

const inputGroupAddonVariants = cva({
  base: [
    'flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none',
    "[&>svg:not([class*='size-'])]:size-4",
    '[&>kbd]:rounded-[calc(var(--radius)-5px)]',
    'group-data-[disabled=true]/input-group:opacity-50'
  ],
  variants: {
    align: {
      'inline-start': 'order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]',
      'inline-end': 'order-last pr-3 has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]',
      'block-start':
        'order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5 [.border-b]:pb-3',
      'block-end': 'order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5 [.border-t]:pt-3'
    }
  },
  defaultVariants: {
    align: 'inline-start'
  }
})

type InputGroupAddonProps = React.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>

const InputGroupAddon = (props: InputGroupAddonProps) => {
  const { className, align = 'inline-start', ...rest } = props

  return (
    <div
      role='group'
      data-slot='input-group-addon'
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) {
          return
        }
        e.currentTarget.parentElement?.querySelector('input')?.focus()
      }}
      {...rest}
    />
  )
}

const inputGroupButtonVariants = cva({
  base: ['flex items-center gap-2 text-sm shadow-none'],
  variants: {
    size: {
      xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-2 has-[>svg]:px-2 [&>svg:not([class*='size-'])]:size-3.5",
      sm: 'h-8 gap-1.5 rounded-md px-2.5 has-[>svg]:px-2.5',
      'icon-xs': 'size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0',
      'icon-sm': 'size-8 p-0 has-[>svg]:p-0'
    }
  },
  defaultVariants: {
    size: 'xs'
  }
})

type InputGroupButtonProps = Omit<React.ComponentProps<typeof Button>, 'size'> &
  VariantProps<typeof inputGroupButtonVariants>

const InputGroupButton = (props: InputGroupButtonProps) => {
  const { className, type = 'button', variant = 'ghost', size = 'xs', ...rest } = props

  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...rest}
    />
  )
}

type InputGroupTextProps = React.ComponentProps<'span'>

const InputGroupText = (props: InputGroupTextProps) => {
  const { className, ...rest } = props

  return (
    <span
      className={cn(
        'flex items-center gap-2 text-sm text-muted-foreground',
        '[&_svg]:pointer-events-none',
        "[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...rest}
    />
  )
}

type InputGroupInputProps = React.ComponentProps<'input'>

const InputGroupInput = (props: InputGroupInputProps) => {
  const { className, ...rest } = props

  return (
    <Input
      data-slot='input-group-control'
      className={cn(
        'flex-1 rounded-none border-0 bg-transparent shadow-none',
        'dark:bg-transparent',
        'focus-visible:ring-0',
        className
      )}
      {...rest}
    />
  )
}

type InputGroupTextareaProps = React.ComponentProps<'textarea'>

const InputGroupTextarea = (props: InputGroupTextareaProps) => {
  const { className, ...rest } = props

  return (
    <Textarea
      data-slot='input-group-control'
      className={cn(
        'flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none',
        'dark:bg-transparent',
        'focus-visible:ring-0',
        className
      )}
      {...rest}
    />
  )
}

export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea }
