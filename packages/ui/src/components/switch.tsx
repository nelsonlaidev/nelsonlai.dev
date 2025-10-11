import { Switch as SwitchPrimitive } from 'radix-ui'

import { cn } from '../utils/cn'

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root>

const Switch = (props: SwitchProps) => {
  const { className, ...rest } = props

  return (
    <SwitchPrimitive.Root
      data-slot='switch'
      className={cn(
        'peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none',
        'dark:data-[state=unchecked]:bg-input/80',
        'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-primary',
        'data-[state=unchecked]:bg-input',
        className
      )}
      {...rest}
    >
      <SwitchPrimitive.Thumb
        data-slot='switch-thumb'
        className={cn(
          'pointer-events-none block size-4 rounded-full bg-background ring-0 transition-transform',
          'dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground',
          'data-[state=checked]:translate-x-[calc(100%-2px)]',
          'data-[state=unchecked]:translate-x-0'
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
