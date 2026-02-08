import { Demo, DemoItem } from '@/components/ui/demo'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

function LabelDemo() {
  return (
    <Demo title='Label'>
      <LabelWithInput />
      <LabelDisabled />
      <LabelWithTextarea />
    </Demo>
  )
}

function LabelWithInput() {
  return (
    <DemoItem title='With Input'>
      <Field>
        <Label htmlFor='label-demo-username'>Username</Label>
        <Input id='label-demo-username' placeholder='Username' />
      </Field>
    </DemoItem>
  )
}

function LabelDisabled() {
  return (
    <DemoItem title='Disabled'>
      <Field data-disabled>
        <Label htmlFor='label-demo-disabled'>Disabled</Label>
        <Input id='label-demo-disabled' placeholder='Disabled' disabled />
      </Field>
    </DemoItem>
  )
}

function LabelWithTextarea() {
  return (
    <DemoItem title='With Textarea'>
      <Field>
        <Label htmlFor='label-demo-message'>Message</Label>
        <Textarea id='label-demo-message' placeholder='Message' />
      </Field>
    </DemoItem>
  )
}

export default LabelDemo
