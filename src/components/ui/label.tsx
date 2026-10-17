'use client'

import { cn } from 'cn'

type LabelProps = React.ComponentProps<'label'>

export function Label(props: LabelProps) {
  const { children, className, htmlFor, ...rest } = props

  return (
    <label
      data-slot='label'
      htmlFor={htmlFor}
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none',
        'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        'peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-50',
        className,
      )}
      {...rest}
    >
      {children}
    </label>
  )
}
