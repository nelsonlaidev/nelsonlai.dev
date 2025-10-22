import { cn } from '../utils/cn'

type TextareaProps = React.ComponentProps<'textarea'>

const Textarea = (props: TextareaProps) => {
  const { className, ...rest } = props

  return (
    <textarea
      data-slot='textarea'
      className={cn(
        'flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none',
        'dark:bg-input/30 dark:aria-invalid:ring-destructive/40',
        'md:text-sm',
        'placeholder:text-muted-foreground',
        'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...rest}
    />
  )
}

export { Textarea }
