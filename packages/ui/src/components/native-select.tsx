import { ChevronDownIcon } from 'lucide-react'

import { cn } from '../utils/cn'

type NativeSelectProps = React.ComponentProps<'select'>

const NativeSelect = (props: NativeSelectProps) => {
  const { className, ...rest } = props

  return (
    <div
      className={cn('group/native-select relative w-fit', 'has-[select:disabled]:opacity-50')}
      data-slot='native-select-wrapper'
    >
      <select
        data-slot='native-select'
        className={cn(
          'border-input h-9 w-full min-w-0 appearance-none rounded-md border bg-transparent px-3 py-2 pr-9 text-sm shadow-xs transition-[color,box-shadow] outline-none',
          'dark:bg-input/30 dark:hover:bg-input/50',
          'placeholder:text-muted-foreground',
          'selection:bg-primary selection:text-primary-foreground',
          'disabled:pointer-events-none disabled:cursor-not-allowed',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'dark:aria-invalid:ring-destructive/40',
          'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
          className
        )}
        {...rest}
      />
      <ChevronDownIcon
        className='pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground opacity-50 select-none'
        aria-hidden='true'
        data-slot='native-select-icon'
      />
    </div>
  )
}

type NativeSelectOptionProps = React.ComponentProps<'option'>

const NativeSelectOption = (props: NativeSelectOptionProps) => {
  return <option data-slot='native-select-option' {...props} />
}

type NativeSelectOptGroupProps = React.ComponentProps<'optgroup'>

const NativeSelectOptGroup = (props: NativeSelectOptGroupProps) => {
  return <optgroup data-slot='native-select-optgroup' {...props} />
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
