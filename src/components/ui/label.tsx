'use client'

import { cn } from '@/utils/cn'

type LabelProps = React.ComponentProps<'label'>

function Label(props: LabelProps) {
  const { className, ...rest } = props

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control -- label is a reusable wrapper component. Association with form controls is handled at the usage site via htmlFor prop or child elements.
    <label
      data-slot='label'
      className={cn(
        `
          flex items-center gap-2 text-sm leading-none font-medium select-none
          group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50
          peer-disabled:cursor-not-allowed peer-disabled:opacity-50
        `,
        className
      )}
      {...rest}
    />
  )
}

export { Label }
