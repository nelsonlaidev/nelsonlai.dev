import { Demo, DemoItem } from '../ui/demo'
import { Field } from '../ui/field'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'

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
