import { Card, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card'
import { BellOffIcon } from 'lucide-react'

const UnsubscribeError = () => {
  return (
    <Card className='w-full max-w-lg'>
      <CardHeader className='space-y-4 text-center'>
        <div className='mx-auto flex size-16 items-center justify-center rounded-full bg-accent'>
          <BellOffIcon className='size-8' />
        </div>
        <div className='space-y-4'>
          <CardTitle className='text-2xl text-balance'>Invalid unsubscribe link</CardTitle>
          <CardDescription className='text-base text-pretty text-muted-foreground'>
            The unsubscribe link is invalid. Please try again.
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  )
}

export default UnsubscribeError
