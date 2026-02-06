import { Demo, DemoItem } from '../ui/demo'
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Switch } from '../ui/switch'
import { Textarea } from '../ui/textarea'

function FieldDemo() {
  return (
    <Demo title='Field'>
      <InputFields />
      <TextareaFields />
      <SelectFields />
      <SwitchFields />
    </Demo>
  )
}

function InputFields() {
  return (
    <DemoItem title='Input Fields'>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='input-basic'>
            Basic Input <span className='text-destructive'>*</span>
          </FieldLabel>
          <Input id='input-basic' placeholder='Enter your username' required />
          <FieldDescription>Choose a unique username for your account.</FieldDescription>
        </Field>
        <Field data-disabled>
          <FieldLabel htmlFor='input-disabled'>Disabled Input</FieldLabel>
          <Input id='input-disabled' placeholder='Cannot edit' disabled />
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor='input-invalid'>Invalid Input</FieldLabel>
          <Input id='input-invalid' placeholder='This field has an error' aria-invalid />
        </Field>
      </FieldGroup>
    </DemoItem>
  )
}

function TextareaFields() {
  return (
    <DemoItem title='Textarea Fields'>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='textarea-basic'>Basic Textarea</FieldLabel>
          <Textarea id='textarea-basic' placeholder='Enter your message' />
          <FieldDescription>Maximum 500 characters allowed.</FieldDescription>
        </Field>
        <Field data-disabled>
          <FieldLabel htmlFor='textarea-disabled-field'>Disabled Field</FieldLabel>
          <Textarea id='textarea-disabled-field' placeholder='Cannot edit' disabled />
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor='textarea-invalid'>Invalid Textarea</FieldLabel>
          <Textarea id='textarea-invalid' placeholder='This field has an error' aria-invalid />
        </Field>
      </FieldGroup>
    </DemoItem>
  )
}

function SelectFields() {
  const countryItems = [
    { label: 'Select your country', value: null },
    { label: 'United States', value: 'us' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Canada', value: 'ca' },
  ]
  const invalidItems = [
    { label: 'This field has an error', value: null },
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ]
  const disabledItems = [
    { label: 'Cannot select', value: null },
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ]

  return (
    <DemoItem title='Select Fields'>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='select-country'>Country</FieldLabel>
          <Select items={countryItems}>
            <SelectTrigger id='select-country'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {countryItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldDescription>Select the country where you currently reside.</FieldDescription>
        </Field>
        <Field data-disabled>
          <FieldLabel htmlFor='select-disabled-field'>Disabled Field</FieldLabel>
          <Select items={disabledItems} disabled>
            <SelectTrigger id='select-disabled-field'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {disabledItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor='select-invalid'>Invalid Select</FieldLabel>
          <Select items={invalidItems}>
            <SelectTrigger id='select-invalid' aria-invalid>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {invalidItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>
    </DemoItem>
  )
}

function SwitchFields() {
  return (
    <DemoItem title='Switch Fields'>
      <FieldGroup>
        <Field orientation='horizontal'>
          <FieldContent>
            <FieldLabel htmlFor='switch-airplane'>Airplane Mode</FieldLabel>
            <FieldDescription>Turn on airplane mode to disable all connections.</FieldDescription>
          </FieldContent>
          <Switch id='switch-airplane' />
        </Field>
        <Field data-disabled orientation='horizontal'>
          <FieldContent>
            <FieldLabel htmlFor='switch-disabled-field'>Disabled Switch</FieldLabel>
          </FieldContent>
          <Switch id='switch-disabled-field' disabled />
        </Field>
        <Field data-invalid orientation='horizontal'>
          <FieldContent>
            <FieldLabel htmlFor='switch-invalid'>Invalid Switch</FieldLabel>
          </FieldContent>
          <Switch id='switch-invalid' aria-invalid />
        </Field>
      </FieldGroup>
    </DemoItem>
  )
}

export default FieldDemo
