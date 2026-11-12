import type { ErrorComponentProps } from '@tanstack/react-router'

import { Button } from '@repo/ui/components/button'
import { useRouter } from '@tanstack/react-router'

import { m } from '@/paraglide/messages'

export function RouteError(props: ErrorComponentProps) {
  const { error, reset } = props
  const router = useRouter()

  return (
    <div
      role='alert'
      className='relative mx-auto w-full max-w-5xl space-y-4 px-6 pt-36 pb-16 wrap-anywhere subpixel-antialiased sm:px-8 sm:pt-40'
    >
      <h1 className='text-4xl tracking-tighter text-foreground lg:text-5xl xl:text-6xl'>
        {m.error_something_went_wrong()}
      </h1>
      <Button
        variant='outline'
        size='xl'
        onClick={async () => {
          await router.invalidate()
          reset()
        }}
      >
        {m.error_try_again()}
      </Button>
      {import.meta.env.DEV && (
        <p className='rounded-xl bg-secondary p-4 font-mono text-sm/normal wrap-break-word'>
          {error instanceof Error ? error.message : String(error)}
        </p>
      )}
    </div>
  )
}
