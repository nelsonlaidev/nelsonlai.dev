import type { ErrorComponentProps } from '@tanstack/react-router'

import { Button } from '@repo/ui/components/button'
import { useRouter } from '@tanstack/react-router'

import { m } from '@/paraglide/messages'

import { CodeBlock } from './mdx/code-block'

export function RouteError(props: ErrorComponentProps) {
  const { error, reset } = props
  const router = useRouter()

  return (
    <div role='alert' className='relative mx-auto w-full max-w-5xl space-y-6 px-6 pt-36 pb-16 sm:px-8 sm:pt-40'>
      <h1 className='text-4xl tracking-tight'>{m.error_something_went_wrong()}</h1>
      <Button
        variant='outline'
        size='lg'
        onClick={async () => {
          await router.invalidate()
          reset()
        }}
      >
        {m.error_try_again()}
      </Button>
      {import.meta.env.DEV && (
        <CodeBlock className='shiki' figureClassName='my-2'>
          <code>{error instanceof Error ? error.message : String(error)}</code>
        </CodeBlock>
      )}
    </div>
  )
}
