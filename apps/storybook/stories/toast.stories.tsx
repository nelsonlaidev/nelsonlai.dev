import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@repo/ui/components/button'
import { createToastManager, toast, Toaster } from '@repo/ui/components/toast'
import { useEffect, useState } from 'react'

const meta = {
  title: 'Overlays and feedback/Toast',
} satisfies Meta

export default meta

type Story = StoryObj

const isolatedManager = createToastManager()

const updateManager = createToastManager()

function ToastExample() {
  const manager = isolatedManager
  useEffect(
    () => () => {
      manager.close()
    },
    [manager],
  )

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap gap-3'>
        {(['success', 'info', 'warning', 'error', 'loading'] as const).map((type) => (
          <Button
            key={type}
            variant='outline'
            onClick={() =>
              manager.add({
                type,
                title: `${type} notification`,
                description: 'A longer local message wraps inside the toast viewport.',
                timeout: type === 'loading' ? 0 : 5000,
              })
            }
          >
            {type}
          </Button>
        ))}
        <Button
          onClick={() =>
            manager.add({
              title: 'Draft ready',
              description: 'Try its action or swipe to dismiss.',
              actionProps: {
                children: 'Undo',
                onClick: () => manager.add({ type: 'info', title: 'Local action undone' }),
              },
            })
          }
        >
          With action
        </Button>
        <Button
          variant='ghost'
          onClick={() => {
            manager.close()
          }}
        >
          Dismiss all
        </Button>
      </div>
      <p className='text-sm text-muted-foreground'>
        Add several toasts, hover or focus the stack, and try the close button.
      </p>
      <Toaster toastManager={manager} limit={3} timeout={5000} />
    </div>
  )
}

export const IsolatedManager: Story = {
  render: () => <ToastExample />,
}

function DefaultToastExample() {
  useEffect(
    () => () => {
      toast.close()
    },
    [],
  )

  return (
    <>
      <Button
        onClick={() => {
          toast.add({ type: 'success', title: 'Default manager notification' })
        }}
      >
        Notify with the default manager
      </Button>
      <Toaster />
    </>
  )
}

export const DefaultManager: Story = {
  render: () => <DefaultToastExample />,
}

function UpdateExample() {
  const manager = updateManager
  const [id, setId] = useState<string>()
  useEffect(
    () => () => {
      manager.close()
    },
    [manager],
  )

  return (
    <div className='flex gap-3'>
      <Button
        onClick={() => {
          setId(manager.add({ type: 'loading', title: 'Preparing local preview', timeout: 0 }))
        }}
      >
        Start
      </Button>
      <Button
        disabled={!id}
        onClick={() => {
          if (id) manager.update(id, { type: 'success', title: 'Preview ready', timeout: 5000 })
        }}
      >
        Complete
      </Button>
      <Toaster toastManager={manager} />
    </div>
  )
}

export const UpdateInPlace: Story = {
  render: () => <UpdateExample />,
}
