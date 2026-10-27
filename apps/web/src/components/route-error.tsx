import type { ErrorComponentProps } from '@tanstack/react-router'

import { Button } from '@repo/ui/components/button'
import { useRouter } from '@tanstack/react-router'

import { m } from '@/paraglide/messages'

export function RouteError(props: ErrorComponentProps) {
  const { error, reset } = props
  const router = useRouter()

  return (
    <div role='alert' className='space-y-4 px-2 py-8'>
      <h1 className='text-2xl font-semibold'>{m.error_something_went_wrong()}</h1>
      <Button
        onClick={async () => {
          await router.invalidate()
          reset()
        }}
      >
        {m.error_try_again()}
      </Button>
      {import.meta.env.DEV && (
        <p className='rounded-xl bg-secondary p-4 wrap-break-word'>
          {error instanceof Error ? error.message : String(error)}
        </p>
      )}
    </div>
  )
}
