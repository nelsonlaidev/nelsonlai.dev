import type { UseInfiniteQueryResult } from '@tanstack/react-query'

import { Button } from '@repo/ui/components/button'
import { useEffect, useRef } from 'react'

import { m } from '@/paraglide/messages'

type InfiniteQueryPaginationProps = {
  query: UseInfiniteQueryResult
  errorMessage: string
  errorClassName: string
  loadMoreSize?: 'default' | 'lg'
}

export function InfiniteQueryPagination(props: InfiniteQueryPaginationProps) {
  const { query, errorMessage, errorClassName, loadMoreSize } = props
  const { hasNextPage, isFetching, isError, fetchNextPage } = query
  const sentinelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasNextPage || isFetching || isError) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) void fetchNextPage()
    })
    observer.observe(sentinel)
    return () => {
      observer.disconnect()
    }
  }, [hasNextPage, isFetching, isError, fetchNextPage])

  if (isError) {
    return (
      <div role='alert' className={errorClassName}>
        <p>{errorMessage}</p>
        <Button
          type='button'
          variant='outline'
          disabled={isFetching}
          onClick={() => {
            if (query.isFetchNextPageError) {
              void fetchNextPage()
            } else {
              void query.refetch()
            }
          }}
        >
          {m.common_retry()}
        </Button>
      </div>
    )
  }

  return (
    <>
      <span ref={sentinelRef} className='invisible' aria-hidden='true' />
      {hasNextPage && !query.isFetchingNextPage && (
        <Button
          type='button'
          variant='outline'
          size={loadMoreSize}
          disabled={isFetching}
          onClick={() => {
            void fetchNextPage()
          }}
        >
          {m.common_load_more()}
        </Button>
      )}
    </>
  )
}
