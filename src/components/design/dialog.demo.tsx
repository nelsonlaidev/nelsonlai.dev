import { Button } from '../ui/button'
import { Demo, DemoItem } from '../ui/demo'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Field, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'

function DialogDemo() {
  return (
    <Demo title='Dialog'>
      <DialogBasic />
    </Demo>
  )
}

function DialogBasic() {
  return (
    <DemoItem>
      <Dialog>
        <form>
          <DialogTrigger render={<Button variant='outline' />}>Edit Profile</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done. Your profile will be updated
                immediately.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='name-1'>Name</FieldLabel>
                <Input id='name-1' name='name' defaultValue='Pedro Duarte' />
              </Field>
              <Field>
                <FieldLabel htmlFor='username-1'>Username</FieldLabel>
                <Input id='username-1' name='username' defaultValue='@peduarte' />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose render={<Button variant='outline' />}>Cancel</DialogClose>
              <Button type='submit'>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </DemoItem>
  )
}

export default DialogDemo
