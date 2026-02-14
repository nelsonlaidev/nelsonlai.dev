'use client'

import { cva, type VariantProps } from 'class-variance-authority'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/utils/cn'

type InputGroupProps = React.ComponentProps<'div'>

function InputGroup(props: InputGroupProps) {
  const { className, ...rest } = props

  return (
    <div
      data-slot='input-group'
      role='group'
      className={cn(
        'group/input-group relative flex h-9 w-full min-w-0 items-center rounded-4xl border border-input bg-input/30 transition-colors outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-data-[align=block-end]:rounded-2xl has-data-[align=block-start]:rounded-2xl has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-[3px] has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[textarea]:rounded-xl has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5',
        className,
      )}
      {...rest}
    />
  )
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 py-2 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 **:data-[slot=kbd]:rounded-4xl **:data-[slot=kbd]:bg-muted-foreground/10 **:data-[slot=kbd]:px-1.5 [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        'inline-start': 'order-first pl-3 has-[>button]:-ml-1 has-[>kbd]:ml-[-0.15rem]',
        'inline-end': 'order-last pr-3 has-[>button]:-mr-1 has-[>kbd]:mr-[-0.15rem]',
        'block-start':
          'order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-3 [.border-b]:pb-3',
        'block-end': 'order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-3 [.border-t]:pt-3',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  },
)

type InputGroupAddonProps = React.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>

function InputGroupAddon(props: InputGroupAddonProps) {
  const { className, align = 'inline-start', ...rest } = props

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
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

const inputGroupButtonVariants = cva('flex items-center gap-2 rounded-4xl text-sm shadow-none', {
  variants: {
    size: {
      xs: "h-6 gap-1 px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
      sm: '',
      'icon-xs': 'size-6 p-0 has-[>svg]:p-0',
      'icon-sm': 'size-8 p-0 has-[>svg]:p-0',
    },
  },
  defaultVariants: {
    size: 'xs',
  },
})

type InputGroupButtonProps = Omit<React.ComponentProps<typeof Button>, 'size' | 'type'> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: 'button' | 'submit' | 'reset'
  }

function InputGroupButton(props: InputGroupButtonProps) {
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

function InputGroupText(props: InputGroupTextProps) {
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

function InputGroupInput(props: InputGroupInputProps) {
  const { className, ...rest } = props

  return (
    <Input
      data-slot='input-group-control'
      className={cn(
        'flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent',
        className,
      )}
      {...rest}
    />
  )
}

type InputGroupTextareaProps = React.ComponentProps<'textarea'>

function InputGroupTextarea(props: InputGroupTextareaProps) {
  const { className, ...rest } = props

  return (
    <Textarea
      data-slot='input-group-control'
      className={cn(
        'flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent',
        className,
      )}
      {...rest}
    />
  )
}

export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea }
