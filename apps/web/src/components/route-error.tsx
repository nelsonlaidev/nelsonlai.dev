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
        onClick={async () => {
          await router.invalidate()
          reset()
        }}
        className='h-auto min-h-12 rounded-md border border-[#a7cabb65] bg-[#b0d3c30b] px-5.75 py-3.5 text-sm/normal whitespace-normal text-[#e0ecde] hover:border-[#b0d3c3] hover:bg-[#b0d3c31c]'
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
