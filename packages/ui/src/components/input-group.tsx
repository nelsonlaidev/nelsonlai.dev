import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'
import { cn } from 'cn'

import { Button } from './button'
import { Input } from './input'
import { Textarea } from './textarea'

type InputGroupProps = React.ComponentProps<'div'>

export function InputGroup(props: InputGroupProps) {
  const { className, ...rest } = props

  return (
    <div
      data-slot='input-group'
      // Preserve the div-based grouping API.
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role='group'
      className={cn(
        'group/input-group relative flex h-9 w-full min-w-0 items-center rounded-md border border-input shadow-xs outline-offset-2 transition-[color,box-shadow]',
        'in-data-[slot=combobox-content]:-outline-offset-2',
        'has-[[data-slot=input-group-control]:disabled]:border-input/50 has-[[data-slot=input-group-control]:disabled]:bg-input/80',
        'has-[[data-slot=input-group-control]:focus-visible]:focus-outline',
        'has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-3',
        'has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col',
        'has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col',
        'has-[>textarea]:h-auto',
        'bg-input/30',
        'has-[[data-slot][aria-invalid=true]]:ring-destructive/40',
        'has-[>[data-align=block-end]]:[&>input]:pt-3',
        'has-[>[data-align=block-start]]:[&>input]:pb-3',
        'has-[>[data-align=inline-end]]:[&>input]:pr-1.5',
        'has-[>[data-align=inline-start]]:[&>input]:pl-1.5',
        className,
      )}
      {...rest}
    />
  )
}

const inputGroupAddonVariants = cva(
  [
    'flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none',
    'group-has-[[data-slot=input-group-control]:disabled]/input-group:opacity-50',
    'group-data-[disabled=true]/input-group:opacity-50',
    '[&>kbd]:rounded-[calc(var(--radius)-5px)]',
    'group-has-[[data-slot=input-group-control]:disabled]/input-group:[&_button:disabled]:opacity-100',
    'group-data-[disabled=true]/input-group:[&_button:disabled]:opacity-100',
    "[&>svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      align: {
        'inline-start': 'order-first pl-2 has-[>button]:-ml-1 has-[>kbd]:ml-[-0.15rem]',
        'inline-end': 'order-last pr-2 has-[>button]:-mr-1 has-[>kbd]:mr-[-0.15rem]',
        'block-start':
          'order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2',
        'block-end': 'order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  },
)

type InputGroupAddonProps = React.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>

export function InputGroupAddon(props: InputGroupAddonProps) {
  const { className, align = 'inline-start', ...rest } = props

  return (
    // Clicking the addon focuses the input; keyboard users focus the input directly.
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <div
      // Preserve the div-based grouping API.
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role='group'
      data-slot='input-group-addon'
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(event) => {
        if (event.target instanceof Element && event.target.closest('button')) {
          return
        }
        event.currentTarget.parentElement
          ?.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea')
          ?.focus()
      }}
      {...rest}
    />
  )
}

const inputGroupButtonVariants = cva('flex items-center gap-2 text-sm shadow-none', {
  variants: {
    size: {
      xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
      sm: '',
      'icon-xs': 'size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0',
      'icon-sm': 'size-8 p-0 has-[>svg]:p-0',
    },
  },
  defaultVariants: {
    size: 'xs',
  },
})

type InputGroupButtonProps = {
  type?: 'button' | 'submit' | 'reset'
} & Omit<React.ComponentProps<typeof Button>, 'size' | 'type'> &
  VariantProps<typeof inputGroupButtonVariants>

export function InputGroupButton(props: InputGroupButtonProps) {
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

export function InputGroupText(props: InputGroupTextProps) {
  const { className, ...rest } = props

  return (
    <span
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...rest}
    />
  )
}

type InputGroupInputProps = React.ComponentProps<'input'>

export function InputGroupInput(props: InputGroupInputProps) {
  const { className, ...rest } = props

  return (
    <Input
      data-slot='input-group-control'
      className={cn(
        'flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 outline-none',
        'aria-invalid:ring-0',
        'disabled:bg-transparent',
        className,
      )}
      {...rest}
    />
  )
}

type InputGroupTextareaProps = React.ComponentProps<'textarea'>

export function InputGroupTextarea(props: InputGroupTextareaProps) {
  const { className, ...rest } = props

  return (
    <Textarea
      data-slot='input-group-control'
      className={cn(
        'flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 outline-none',
        'aria-invalid:ring-0',
        'disabled:bg-transparent',
        className,
      )}
      {...rest}
    />
  )
}
