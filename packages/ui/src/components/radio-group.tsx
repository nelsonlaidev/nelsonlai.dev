import { CircleIcon } from 'lucide-react'
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'

import { cn } from '../utils/cn'

type RadioGroupProps = React.ComponentProps<typeof RadioGroupPrimitive.Root>

const RadioGroup = (props: RadioGroupProps) => {
  const { className, ...rest } = props

  return <RadioGroupPrimitive.Root data-slot='radio-group' className={cn('grid gap-3', className)} {...rest} />
}

type RadioGroupItemProps = React.ComponentProps<typeof RadioGroupPrimitive.Item>

const RadioGroupItem = (props: RadioGroupItemProps) => {
  const { className, ...rest } = props

  return (
    <RadioGroupPrimitive.Item
      data-slot='radio-group-item'
      className={cn(
        'aspect-square size-4 shrink-0 rounded-full border border-input text-primary shadow-xs transition-[color,box-shadow] outline-none',
        'dark:bg-input/30 dark:aria-invalid:ring-destructive/40',
        'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...rest}
    >
      <RadioGroupPrimitive.Indicator
        data-slot='radio-group-indicator'
        className='relative flex items-center justify-center'
      >
        <CircleIcon className='absolute top-1/2 left-1/2 size-2 -translate-1/2 fill-primary' />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
