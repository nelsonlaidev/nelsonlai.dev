import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Demo, DemoItem } from '../ui/demo'
import { Field, FieldLabel } from '../ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { Spinner } from '../ui/spinner'

function SpinnerDemo() {
  return (
    <Demo title='Spinner'>
      <SpinnerBasic />
      <SpinnerInButtons />
      <SpinnerInBadges />
      <SpinnerInInputGroup />
    </Demo>
  )
}

function SpinnerBasic() {
  return (
    <DemoItem title='Basic' className='items-center data-horizontal:gap-6'>
      <Spinner />
      <Spinner className='size-6' />
    </DemoItem>
  )
}

function SpinnerInButtons() {
  return (
    <DemoItem title='In Buttons' className='data-horizontal:gap-4'>
      <Button>
        <Spinner data-icon='inline-start' /> Submit
      </Button>
      <Button disabled>
        <Spinner data-icon='inline-start' /> Disabled
      </Button>
      <Button variant='outline' disabled>
        <Spinner data-icon='inline-start' /> Outline
      </Button>
      <Button variant='outline' size='icon' disabled>
        <Spinner data-icon='inline-start' />
        <span className='sr-only'>Loading...</span>
      </Button>
    </DemoItem>
  )
}

function SpinnerInBadges() {
  return (
    <DemoItem title='In Badges' className='data-horizontal:gap-4'>
      <Badge>
        <Spinner data-icon='inline-start' />
        Badge
      </Badge>
      <Badge variant='secondary'>
        <Spinner data-icon='inline-start' />
        Badge
      </Badge>
      <Badge variant='destructive'>
        <Spinner data-icon='inline-start' />
        Badge
      </Badge>
      <Badge variant='outline'>
        <Spinner data-icon='inline-start' />
        Badge
      </Badge>
    </DemoItem>
  )
}

function SpinnerInInputGroup() {
  return (
    <DemoItem title='In Input Group'>
      <Field>
        <FieldLabel htmlFor='input-group-spinner'>Input Group</FieldLabel>
        <InputGroup>
          <InputGroupInput id='input-group-spinner' />
          <InputGroupAddon>
            <Spinner />
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </DemoItem>
  )
}

export default SpinnerDemo
