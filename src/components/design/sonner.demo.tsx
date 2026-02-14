'use client'

import { toast } from 'sonner'

import { sleep } from '@/utils/sleep'

import { Button } from '../ui/button'
import { Demo, DemoItem } from '../ui/demo'

function SonnerDemo() {
  return (
    <Demo title='Sonner'>
      <SonnerBasic />
      <SonnerWithDescription />
      <SonnerTypes />
    </Demo>
  )
}

function SonnerBasic() {
  return (
    <DemoItem title='Basic'>
      <Button onClick={() => toast('Event has been created')} variant='outline'>
        Show Toast
      </Button>
    </DemoItem>
  )
}

async function promiseTask() {
  await sleep(2000)
  return { name: 'Event' }
}

function SonnerTypes() {
  return (
    <DemoItem title='Types'>
      <Button variant='outline' onClick={() => toast.success('Event has been created')}>
        Success
      </Button>
      <Button variant='outline' onClick={() => toast.info('Be at the area 10 minutes before the event time')}>
        Info
      </Button>
      <Button variant='outline' onClick={() => toast.warning('Event start time cannot be earlier than 8am')}>
        Warning
      </Button>
      <Button variant='outline' onClick={() => toast.error('Event has not been created')}>
        Error
      </Button>
      <Button
        variant='outline'
        onClick={() => {
          toast.promise<{ name: string }>(promiseTask, {
            loading: 'Loading...',
            success: (data) => `${data.name} has been created`,
            error: 'Error',
          })
        }}
      >
        Promise
      </Button>
    </DemoItem>
  )
}

function SonnerWithDescription() {
  return (
    <DemoItem title='With Description'>
      <Button
        onClick={() =>
          toast('Event has been created', {
            description: 'Monday, January 3rd at 6:00pm',
          })
        }
        variant='outline'
      >
        Show Toast
      </Button>
    </DemoItem>
  )
}

export default SonnerDemo
