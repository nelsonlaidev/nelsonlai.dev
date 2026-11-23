import { Button } from '@repo/ui/components/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPrimitive,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog'
import { Input } from '@repo/ui/components/input'
import { Label } from '@repo/ui/components/label'
import { useState } from 'react'

import preview from '../.storybook/preview'

const meta = preview.meta({
  title: 'Components/Dialog',
  component: DialogExample,
})

type DialogExampleProps = {
  closeIcon?: boolean
  long?: boolean
}

function DialogExample(props: DialogExampleProps) {
  const { closeIcon = true, long = false } = props
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Open dialog</DialogTrigger>
      <DialogContent showCloseButton={closeIcon} className='max-h-[85dvh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Edit a local draft</DialogTitle>
          <DialogDescription>This form never submits or saves to a server.</DialogDescription>
        </DialogHeader>
        <div className='space-y-2'>
          <Label htmlFor='dialog-title'>Draft title</Label>
          <Input id='dialog-title' defaultValue='A reef study' />
        </div>
        {long && (
          <div className='space-y-4'>
            {Array.from({ length: 12 }, (_, index) => (
              <p key={index}>
                Section {index + 1}: Longer content should scroll inside the dialog while remaining readable on mobile.
              </p>
            ))}
          </div>
        )}
        <DialogFooter showCloseButton closeLabel='Cancel'>
          <DialogClose render={<Button />}>Keep local draft</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const Controlled = meta.story()

export const WithoutCloseIcon = meta.story({ args: { closeIcon: false } })

export const ScrollingContent = meta.story({ args: { long: true } })

const detachedHandle = DialogPrimitive.createHandle<unknown>()

export const DetachedTrigger = meta.story({
  render: () => (
    <>
      <DialogTrigger handle={detachedHandle} render={<Button />}>
        Open detached dialog
      </DialogTrigger>
      <Dialog handle={detachedHandle}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detached trigger</DialogTitle>
            <DialogDescription>The trigger shares a handle with a dialog elsewhere in this tree.</DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </>
  ),
})
