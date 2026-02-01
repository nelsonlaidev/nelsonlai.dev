import { Demo, DemoItem } from '../ui/demo'
import { Field, FieldLabel } from '../ui/field'
import { Switch } from '../ui/switch'

function SwitchDemo() {
  return (
    <Demo title='Switch'>
      <SwitchBasic />
      <SwitchSizes />
    </Demo>
  )
}

function SwitchBasic() {
  return (
    <DemoItem title='Basic' orientation='vertical'>
      <Field orientation='horizontal'>
        <Switch id='switch-basic' />
        <FieldLabel htmlFor='switch-basic'>Airplane Mode</FieldLabel>
      </Field>
      <Field orientation='horizontal'>
        <Switch id='switch-disabled-unchecked' disabled />
        <FieldLabel htmlFor='switch-disabled-unchecked'>Disabled (Unchecked)</FieldLabel>
      </Field>
      <Field orientation='horizontal'>
        <Switch id='switch-disabled-checked' defaultChecked disabled />
        <FieldLabel htmlFor='switch-disabled-checked'>Disabled (Checked)</FieldLabel>
      </Field>
    </DemoItem>
  )
}

function SwitchSizes() {
  return (
    <DemoItem title='Sizes' orientation='vertical'>
      <Field orientation='horizontal'>
        <Switch id='switch-size-sm' size='sm' />
        <FieldLabel htmlFor='switch-size-sm'>Small</FieldLabel>
      </Field>
      <Field orientation='horizontal'>
        <Switch id='switch-size-default' defaultChecked />
        <FieldLabel htmlFor='switch-size-default'>Default</FieldLabel>
      </Field>
    </DemoItem>
  )
}

export default SwitchDemo
