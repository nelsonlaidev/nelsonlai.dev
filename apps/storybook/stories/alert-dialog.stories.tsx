import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/ui/components/alert-dialog'
import { Button } from '@repo/ui/components/button'
import { TriangleAlertIcon } from 'lucide-react'
import { useState } from 'react'

import preview from '../.storybook/preview'

const meta = preview.meta({
  title: 'Components/Alert dialog',
})

type AlertExampleProps = {
  size?: 'default' | 'sm'
}

function AlertExample(props: AlertExampleProps) {
  const { size = 'default' } = props
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState('Nothing changed')

  return (
    <div className='space-y-4'>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger render={<Button variant='destructive' />}>Discard local draft</AlertDialogTrigger>
        <AlertDialogContent size={size}>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <TriangleAlertIcon aria-hidden='true' />
            </AlertDialogMedia>
            <AlertDialogTitle>Discard this example draft?</AlertDialogTitle>
            <AlertDialogDescription>
              This confirmation only changes state in this browser example. It cannot delete real records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep draft</AlertDialogCancel>
            <AlertDialogAction
              variant='destructive'
              onClick={() => {
                setResult('Example draft discarded')
                setOpen(false)
              }}
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <output>{result}</output>
    </div>
  )
}

export const Default = meta.story({
  render: () => <AlertExample />,
})

export const Small = meta.story({
  render: () => <AlertExample size='sm' />,
})
