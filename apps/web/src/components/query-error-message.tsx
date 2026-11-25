import type { UseQueryResult } from '@tanstack/react-query'

import { Button } from '@repo/ui/components/button'
import { cn } from 'cn'

import { m } from '@/paraglide/messages'

type QueryErrorMessageProps = {
  query: Pick<UseQueryResult, 'refetch' | 'isFetching'>
  message?: string
  className?: string
}

export function QueryErrorMessage(props: QueryErrorMessageProps) {
  const { query, message, className } = props

  return (
    <span className={cn('inline-flex flex-wrap items-center gap-2', className)}>
      <span role='alert'>{message ?? m.common_error()}</span>
      <Button
        type='button'
        variant='outline'
        size='xs'
        disabled={query.isFetching}
        onClick={() => {
          void query.refetch()
        }}
      >
        {m.common_retry()}
      </Button>
    </span>
  )
}
