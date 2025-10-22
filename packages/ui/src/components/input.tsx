import { cn } from '../utils/cn'

type InputProps = React.ComponentProps<'input'>

const Input = (props: InputProps) => {
  const { className, type, ...rest } = props

  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none',
        'dark:bg-input/30',
        'md:text-sm',
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
        'placeholder:text-muted-foreground',
        'selection:bg-primary selection:text-primary-foreground',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
        'dark:aria-invalid:ring-destructive/40',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        className
      )}
      {...rest}
    />
  )
}

export { Input }
