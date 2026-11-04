import type { ErrorComponentProps } from '@tanstack/react-router'

import { Button } from '@repo/ui/components/button'
import { useRouter } from '@tanstack/react-router'

import { m } from '@/paraglide/messages'

export function RouteError(props: ErrorComponentProps) {
  const { error, reset } = props
  const router = useRouter()

  return (
    <div role='alert' className='relative space-y-4 px-2 py-8 wrap-anywhere subpixel-antialiased'>
      <h1 className='text-[clamp(32px,4vw,60px)] leading-[1.1] font-[420] tracking-tighter text-[#edf3e8]'>
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
