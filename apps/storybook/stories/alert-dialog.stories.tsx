import type { Meta, StoryObj } from '@storybook/react-vite'

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

const meta = {
  title: 'Overlays and feedback/Alert dialog',
  parameters: {
    docs: {
      description: {
        component:
          'Import the AlertDialog* parts from @repo/ui/components/alert-dialog. The action is a Button, not an implicit close: update controlled open state after the operation succeeds. Cancel closes through the primitive. The examples only update local text.',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj

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

export const Default: Story = {
  render: () => <AlertExample />,
}

export const Small: Story = {
  render: () => <AlertExample size='sm' />,
}
