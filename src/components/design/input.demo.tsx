import { Button } from '../ui/button'
import { Demo, DemoItem } from '../ui/demo'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

function InputDemo() {
  return (
    <Demo title='Input'>
      <InputBasic />
      <InputWithLabel />
      <InputWithDescription />
      <InputTypes />
      <InputWithSelect />
      <InputWithButton />
      <InputForm />
    </Demo>
  )
}

function InputBasic() {
  return (
    <DemoItem title='Basic'>
      <Input type='email' placeholder='Email' />
      <Input type='email' placeholder='Email' disabled />
      <Input type='text' placeholder='Error' aria-invalid='true' />
    </DemoItem>
  )
}

function InputWithLabel() {
  return (
    <DemoItem title='With Label'>
      <Field>
        <FieldLabel htmlFor='input-demo-email'>Email</FieldLabel>
        <Input id='input-demo-email' type='email' placeholder='name@example.com' />
      </Field>
    </DemoItem>
  )
}

function InputWithDescription() {
  return (
    <DemoItem title='With Description'>
      <Field>
        <FieldLabel htmlFor='input-demo-username'>Username</FieldLabel>
        <Input id='input-demo-username' type='text' placeholder='Enter your username' />
        <FieldDescription>Choose a unique username for your account.</FieldDescription>
      </Field>
    </DemoItem>
  )
}

function InputTypes() {
  return (
    <DemoItem title='Input Types' orientation='vertical'>
      <Field>
        <FieldLabel htmlFor='input-demo-password'>Password</FieldLabel>
        <Input id='input-demo-password' type='password' placeholder='Password' />
      </Field>
      <Field>
        <FieldLabel htmlFor='input-demo-tel'>Phone</FieldLabel>
        <Input id='input-demo-tel' type='tel' placeholder='+1 (555) 123-4567' />
      </Field>
      <Field>
        <FieldLabel htmlFor='input-demo-url'>URL</FieldLabel>
        <Input id='input-demo-url' type='url' placeholder='https://example.com' />
      </Field>
      <Field>
        <FieldLabel htmlFor='input-demo-search'>Search</FieldLabel>
        <Input id='input-demo-search' type='search' placeholder='Search' />
      </Field>
      <Field>
        <FieldLabel htmlFor='input-demo-number'>Number</FieldLabel>
        <Input id='input-demo-number' type='number' placeholder='123' />
      </Field>
      <Field>
        <FieldLabel htmlFor='input-demo-date'>Date</FieldLabel>
        <Input id='input-demo-date' type='date' />
      </Field>
      <Field>
        <FieldLabel htmlFor='input-demo-time'>Time</FieldLabel>
        <Input id='input-demo-time' type='time' />
      </Field>
      <Field>
        <FieldLabel htmlFor='input-demo-file'>File</FieldLabel>
        <Input id='input-demo-file' type='file' />
      </Field>
    </DemoItem>
  )
}

function InputWithSelect() {
  const items = [
    { label: 'USD', value: 'usd' },
    { label: 'EUR', value: 'eur' },
    { label: 'GBP', value: 'gbp' },
  ]

  return (
    <DemoItem title='With Select'>
      <Input type='text' placeholder='Enter amount' className='flex-1' />
      <Select items={items} defaultValue='usd'>
        <SelectTrigger className='w-32'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </DemoItem>
  )
}

function InputWithButton() {
  return (
    <DemoItem title='With Button'>
      <Input type='search' placeholder='Search...' className='flex-1' />
      <Button>Search</Button>
    </DemoItem>
  )
}

function InputForm() {
  const items = [
    { label: 'United States', value: 'us' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Canada', value: 'ca' },
  ]

  return (
    <DemoItem title='Form'>
      <form className='w-full'>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor='form-name'>Name</FieldLabel>
            <Input id='form-name' type='text' placeholder='John Doe' />
          </Field>
          <Field>
            <FieldLabel htmlFor='form-email'>Email</FieldLabel>
            <Input id='form-email' type='email' placeholder='john@example.com' />
            <FieldDescription>We'll never share your email with anyone.</FieldDescription>
          </Field>
          <div className='grid grid-cols-2 gap-4'>
            <Field>
              <FieldLabel htmlFor='form-phone'>Phone</FieldLabel>
              <Input id='form-phone' type='tel' placeholder='+1 (555) 123-4567' />
            </Field>
            <Field>
              <FieldLabel htmlFor='form-country'>Country</FieldLabel>
              <Select items={items} defaultValue='us'>
                <SelectTrigger id='form-country'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor='form-address'>Address</FieldLabel>
            <Input id='form-address' type='text' placeholder='123 Main St' />
          </Field>
          <Field orientation='horizontal'>
            <Button type='button' variant='outline'>
              Cancel
            </Button>
            <Button type='submit'>Submit</Button>
          </Field>
        </FieldGroup>
      </form>
    </DemoItem>
  )
}

export default InputDemo
