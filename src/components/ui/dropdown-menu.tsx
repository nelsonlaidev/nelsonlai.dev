'use client'

import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import { CheckIcon, ChevronRightIcon } from 'lucide-react'

import { cn } from '@/utils/cn'

type DropdownMenuProps = MenuPrimitive.Root.Props

function DropdownMenu(props: DropdownMenuProps) {
  return <MenuPrimitive.Root data-slot='dropdown-menu' {...props} />
}

type DropdownMenuPortalProps = MenuPrimitive.Portal.Props

function DropdownMenuPortal(props: DropdownMenuPortalProps) {
  return <MenuPrimitive.Portal data-slot='dropdown-menu-portal' {...props} />
}

type DropdownMenuTriggerProps = MenuPrimitive.Trigger.Props

function DropdownMenuTrigger(props: DropdownMenuTriggerProps) {
  return <MenuPrimitive.Trigger data-slot='dropdown-menu-trigger' {...props} />
}

type DropdownMenuContentProps = MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>

function DropdownMenuContent(props: DropdownMenuContentProps) {
  const { align = 'start', alignOffset = 0, side = 'bottom', sideOffset = 4, className, ...rest } = props

  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className='isolate z-50 outline-none'
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot='dropdown-menu-content'
          className={cn(
            'z-50 max-h-(--available-height) w-(--anchor-width) min-w-48 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-2xl bg-popover p-1 text-popover-foreground shadow-xl ring-1 ring-foreground/5 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95',
            className,
          )}
          {...rest}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

type DropdownMenuGroupProps = MenuPrimitive.Group.Props

function DropdownMenuGroup(props: DropdownMenuGroupProps) {
  return <MenuPrimitive.Group data-slot='dropdown-menu-group' {...props} />
}

type DropdownMenuLabelProps = MenuPrimitive.GroupLabel.Props & {
  inset?: boolean
}

function DropdownMenuLabel(props: DropdownMenuLabelProps) {
  const { className, inset, ...rest } = props

  return (
    <MenuPrimitive.GroupLabel
      data-slot='dropdown-menu-label'
      data-inset={inset}
      className={cn('px-3 py-2.5 text-xs text-muted-foreground data-inset:pl-8', className)}
      {...rest}
    />
  )
}

type DropdownMenuItemProps = MenuPrimitive.Item.Props & {
  inset?: boolean
  variant?: 'default' | 'destructive'
}

function DropdownMenuItem(props: DropdownMenuItemProps) {
  const { className, inset, variant = 'default', ...rest } = props

  return (
    <MenuPrimitive.Item
      data-slot='dropdown-menu-item'
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "group/dropdown-menu-item relative flex cursor-default items-center gap-2.5 rounded-xl px-3 py-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive",
        className,
      )}
      {...rest}
    />
  )
}

type DropdownMenuSubProps = MenuPrimitive.SubmenuRoot.Props

function DropdownMenuSub(props: DropdownMenuSubProps) {
  return <MenuPrimitive.SubmenuRoot data-slot='dropdown-menu-sub' {...props} />
}

type DropdownMenuSubTriggerProps = MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}

function DropdownMenuSubTrigger(props: DropdownMenuSubTriggerProps) {
  const { className, inset, children, ...rest } = props

  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot='dropdown-menu-sub-trigger'
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center gap-2 rounded-xl px-3 py-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-8 data-popup-open:bg-accent data-popup-open:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...rest}
    >
      {children}
      <ChevronRightIcon className='ml-auto' />
    </MenuPrimitive.SubmenuTrigger>
  )
}

type DropdownMenuSubContentProps = React.ComponentProps<typeof DropdownMenuContent>

function DropdownMenuSubContent(props: DropdownMenuSubContentProps) {
  const { align = 'start', alignOffset = -3, side = 'right', sideOffset = 0, className, ...rest } = props

  return (
    <DropdownMenuContent
      data-slot='dropdown-menu-sub-content'
      className={cn(
        'w-auto min-w-36 rounded-2xl bg-popover p-1 text-popover-foreground shadow-xl ring-1 ring-foreground/5 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
        className,
      )}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...rest}
    />
  )
}

type DropdownMenuCheckboxItemProps = MenuPrimitive.CheckboxItem.Props

function DropdownMenuCheckboxItem(props: DropdownMenuCheckboxItemProps) {
  const { className, children, checked, ...rest } = props

  return (
    <MenuPrimitive.CheckboxItem
      data-slot='dropdown-menu-checkbox-item'
      className={cn(
        "relative flex cursor-default items-center gap-2.5 rounded-xl py-2 pr-8 pl-3 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      checked={checked}
      {...rest}
    >
      <span
        className='pointer-events-none absolute right-2 flex items-center justify-center'
        data-slot='dropdown-menu-checkbox-item-indicator'
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

type DropdownMenuRadioGroupProps = MenuPrimitive.RadioGroup.Props

function DropdownMenuRadioGroup(props: DropdownMenuRadioGroupProps) {
  return <MenuPrimitive.RadioGroup data-slot='dropdown-menu-radio-group' {...props} />
}

type DropdownMenuRadioItemProps = MenuPrimitive.RadioItem.Props

function DropdownMenuRadioItem(props: DropdownMenuRadioItemProps) {
  const { className, children, ...rest } = props

  return (
    <MenuPrimitive.RadioItem
      data-slot='dropdown-menu-radio-item'
      className={cn(
        "relative flex cursor-default items-center gap-2.5 rounded-xl py-2 pr-8 pl-3 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...rest}
    >
      <span
        className='pointer-events-none absolute right-2 flex items-center justify-center'
        data-slot='dropdown-menu-radio-item-indicator'
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

type DropdownMenuSeparatorProps = MenuPrimitive.Separator.Props

function DropdownMenuSeparator(props: DropdownMenuSeparatorProps) {
  const { className, ...rest } = props

  return (
    <MenuPrimitive.Separator
      data-slot='dropdown-menu-separator'
      className={cn('-mx-1 my-1 h-px bg-border/50', className)}
      {...rest}
    />
  )
}

type DropdownMenuShortcutProps = React.ComponentProps<'span'>

function DropdownMenuShortcut(props: DropdownMenuShortcutProps) {
  const { className, ...rest } = props

  return (
    <span
      data-slot='dropdown-menu-shortcut'
      className={cn(
        'ml-auto text-xs tracking-widest text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground',
        className,
      )}
      {...rest}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
}
