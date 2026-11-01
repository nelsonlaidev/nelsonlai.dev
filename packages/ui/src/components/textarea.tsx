import { cn } from 'cn'

type TextareaProps = React.ComponentProps<'textarea'>

export function Textarea(props: TextareaProps) {
  const { className, ...rest } = props

  return (
    <textarea
      data-slot='textarea'
      className={cn(
        'flex field-sizing-content min-h-16 w-full resize-none rounded-md border border-input px-2.5 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none',
        'placeholder:text-muted-foreground',
        'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
        'disabled:cursor-not-allowed disabled:bg-input/80 disabled:opacity-50',
        'aria-invalid:ring-3',
        'md:text-sm',
        'bg-input/30',
        'aria-invalid:border-destructive/50 aria-invalid:ring-destructive/40',
        className,
      )}
      {...rest}
    />
  )
}
