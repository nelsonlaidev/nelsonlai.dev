import { Demo, DemoItem } from '../ui/demo'
import { Field, FieldDescription, FieldLabel } from '../ui/field'
import { Textarea } from '../ui/textarea'

function TextareaDemo() {
  return (
    <Demo title='Textarea'>
      <TextareaBasic />
      <TextareaWithLabel />
      <TextareaWithDescription />
    </Demo>
  )
}

function TextareaBasic() {
  return (
    <DemoItem title='Basic' orientation='vertical'>
      <Textarea placeholder='Type your message here.' />
      <Textarea placeholder='Type your message here.' disabled />
      <Textarea placeholder='Type your message here.' aria-invalid='true' />
    </DemoItem>
  )
}

function TextareaWithLabel() {
  return (
    <DemoItem title='With Label'>
      <Field>
        <FieldLabel htmlFor='textarea-with-label'>Message</FieldLabel>
        <Textarea id='textarea-with-label' placeholder='Type your message here.' rows={6} />
      </Field>
    </DemoItem>
  )
}

function TextareaWithDescription() {
  return (
    <DemoItem title='With Description'>
      <Field>
        <FieldLabel htmlFor='textarea-with-description'>Message</FieldLabel>
        <Textarea id='textarea-with-description' placeholder='Type your message here.' rows={6} />
        <FieldDescription>Type your message and press enter to send.</FieldDescription>
      </Field>
    </DemoItem>
  )
}

export default TextareaDemo
