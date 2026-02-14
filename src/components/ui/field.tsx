'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { useMemo } from 'react'

import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utils/cn'

type FieldSetProps = React.ComponentProps<'fieldset'>

function FieldSet(props: FieldSetProps) {
  const { className, ...rest } = props

  return (
    <fieldset
      data-slot='field-set'
      className={cn(
        'flex flex-col gap-6 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3',
        className,
      )}
      {...rest}
    />
  )
}

type FieldLegendProps = React.ComponentProps<'legend'> & { variant?: 'legend' | 'label' }

function FieldLegend(props: FieldLegendProps) {
  const { className, variant = 'legend', ...rest } = props

  return (
    <legend
      data-slot='field-legend'
      data-variant={variant}
      className={cn('mb-3 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base', className)}
      {...rest}
    />
  )
}

type FieldGroupProps = React.ComponentProps<'div'>

function FieldGroup(props: FieldGroupProps) {
  const { className, ...rest } = props

  return (
    <div
      data-slot='field-group'
      className={cn(
        'group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4',
        className,
      )}
      {...rest}
    />
  )
}

const fieldVariants = cva('group/field flex w-full gap-3 data-[invalid=true]:text-destructive', {
  variants: {
    orientation: {
      vertical: 'flex-col *:w-full [&>.sr-only]:w-auto',
      horizontal:
        'flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
      responsive:
        'flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
})

type FieldProps = React.ComponentProps<'div'> & VariantProps<typeof fieldVariants>

function Field(props: FieldProps) {
  const { className, orientation = 'vertical', ...rest } = props

  return (
    <div
      role='group'
      data-slot='field'
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...rest}
    />
  )
}

type FieldContentProps = React.ComponentProps<'div'>

function FieldContent(props: FieldContentProps) {
  const { className, ...rest } = props

  return (
    <div
      data-slot='field-content'
      className={cn('group/field-content flex flex-1 flex-col gap-1 leading-snug', className)}
      {...rest}
    />
  )
}

type FieldLabelProps = React.ComponentProps<typeof Label>

function FieldLabel(props: FieldLabelProps) {
  const { className, ...rest } = props

  return (
    <Label
      data-slot='field-label'
      className={cn(
        'group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-data-checked:border-primary/50 has-data-checked:bg-primary/5 has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-xl has-[>[data-slot=field]]:border *:data-[slot=field]:p-4 dark:has-data-checked:bg-primary/10',
        className,
      )}
      {...rest}
    />
  )
}

type FieldTitleProps = React.ComponentProps<'div'>

function FieldTitle(props: FieldTitleProps) {
  const { className, ...rest } = props

  return (
    <div
      data-slot='field-label'
      className={cn(
        'flex w-fit items-center gap-2 text-sm/snug font-medium group-data-[disabled=true]/field:opacity-50',
        className,
      )}
      {...rest}
    />
  )
}

type FieldDescriptionProps = React.ComponentProps<'p'>

function FieldDescription(props: FieldDescriptionProps) {
  const { className, ...rest } = props

  return (
    <p
      data-slot='field-description'
      className={cn(
        'text-left text-sm/normal font-normal text-muted-foreground group-has-data-[orientation=horizontal]/field:text-balance last:mt-0 nth-last-2:-mt-1 [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary [[data-variant=legend]+&]:-mt-1.5',
        className,
      )}
      {...rest}
    />
  )
}

type FieldSeparatorProps = React.ComponentProps<'div'> & {
  children?: React.ReactNode
}

function FieldSeparator(props: FieldSeparatorProps) {
  const { children, className, ...rest } = props

  return (
    <div
      data-slot='field-separator'
      data-content={Boolean(children)}
      className={cn('relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2', className)}
      {...rest}
    >
      <Separator className='absolute inset-0 top-1/2' />
      {children && (
        <span
          className='relative mx-auto block w-fit bg-background px-2 text-muted-foreground'
          data-slot='field-separator-content'
        >
          {children}
        </span>
      )}
    </div>
  )
}

type FieldErrorProps = React.ComponentProps<'div'> & {
  errors?: Array<{ message?: string } | undefined>
}

function FieldError(props: FieldErrorProps) {
  const { className, children, errors, ...rest } = props

  // ReactNode includes Promise<AwaitedReactNode>,
  // which triggers this rule incorrectly in Client Components.
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()]

    if (uniqueErrors.length === 1) {
      return uniqueErrors[0]?.message
    }

    return (
      <ul className='ml-4 flex list-disc flex-col gap-1'>
        {uniqueErrors.map((error, index) => error?.message && <li key={index}>{error.message}</li>)}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role='alert'
      data-slot='field-error'
      className={cn('text-sm font-normal text-destructive', className)}
      {...rest}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
}
