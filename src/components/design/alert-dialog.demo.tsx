'use client'

import { BluetoothIcon, Trash2Icon } from 'lucide-react'

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
} from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { Demo, DemoItem } from '../ui/demo'
import { Link } from '../ui/link'

function AlertDialogDemo() {
  return (
    <Demo title='Alert Dialog'>
      <AlertDialogSizes />
      <AlertDialogWithMedia />
      <AlertDialogDestructive />
    </Demo>
  )
}

function AlertDialogSizes() {
  return (
    <DemoItem title='Sizes'>
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant='outline'>Default</Button>} />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant='outline'>Small</Button>} />
        <AlertDialogContent size='sm'>
          <AlertDialogHeader>
            <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to allow the USB accessory to connect to this device?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Don't allow</AlertDialogCancel>
            <AlertDialogAction>Allow</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DemoItem>
  )
}

function AlertDialogWithMedia() {
  return (
    <DemoItem title='With Media'>
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant='outline'>Default (Media)</Button>} />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <BluetoothIcon />
            </AlertDialogMedia>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant='outline'>Small (Media)</Button>} />

        <AlertDialogContent size='sm'>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <BluetoothIcon />
            </AlertDialogMedia>
            <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to allow the USB accessory to connect to this device?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Don't allow</AlertDialogCancel>
            <AlertDialogAction>Allow</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DemoItem>
  )
}

function AlertDialogDestructive() {
  return (
    <DemoItem title='Destructive'>
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant='destructive'>Delete Chat</Button>} />
        <AlertDialogContent size='sm'>
          <AlertDialogHeader>
            <AlertDialogMedia className='bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive'>
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this chat conversation. View <Link href='/settings'>Settings</Link> delete
              any memories saved during this chat.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant='ghost'>Cancel</AlertDialogCancel>
            <AlertDialogAction variant='destructive'>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DemoItem>
  )
}

export default AlertDialogDemo
