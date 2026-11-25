import type { UseQueryResult } from '@tanstack/react-query'

import { Button } from '@repo/ui/components/button'
import { cn } from 'cn'

import { m } from '@/paraglide/messages'

type QueryErrorMessageProps = {
  query: Pick<UseQueryResult, 'refetch' | 'isFetching'>
  inline?: boolean
  role?: 'alert'
  message?: string
  className?: string
}

export function QueryErrorMessage(props: QueryErrorMessageProps) {
  const { query, message, className, role, inline = false } = props
  const Container = inline ? 'span' : 'div'
  const Message = inline ? 'span' : 'p'

  return (
    <Container className={cn('flex-wrap items-center gap-2', inline ? 'inline-flex' : 'flex', className)}>
      <Message role={role}>{message ?? m.common_error()}</Message>
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
    </Container>
  )
}
