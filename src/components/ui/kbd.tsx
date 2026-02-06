import { cn } from '@/utils/cn'

type KbdProps = React.ComponentProps<'kbd'>

function Kbd(props: KbdProps) {
  const { className, ...rest } = props

  return (
    <kbd
      data-slot='kbd'
      className={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans text-xs font-medium text-muted-foreground select-none in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3",
        className,
      )}
      {...rest}
    />
  )
}

type KbdGroupProps = React.ComponentProps<'kbd'>

function KbdGroup(props: KbdGroupProps) {
  const { className, ...rest } = props

  return <kbd data-slot='kbd-group' className={cn('inline-flex items-center gap-1', className)} {...rest} />
}

export { Kbd, KbdGroup }
