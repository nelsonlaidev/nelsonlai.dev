import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from '@repo/ui/components/field'
import { Input } from '@repo/ui/components/input'
import { Switch } from '@repo/ui/components/switch'

import preview from '../.storybook/preview'

const meta = preview.meta({
  title: 'Components/Field',
})

export const FormAnatomy = meta.story({
  render: () => (
    <FieldSet className='max-w-xl'>
      <FieldLegend>Local preferences</FieldLegend>
      <FieldDescription>All values stay in this example.</FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='field-name'>Display name</FieldLabel>
          <Input id='field-name' aria-describedby='field-hint' />
          <FieldDescription id='field-hint'>A public name with enough room for longer translations.</FieldDescription>
        </Field>
        <FieldSeparator>Optional</FieldSeparator>
        <Field orientation='horizontal'>
          <FieldContent>
            <FieldLabel htmlFor='field-switch'>Enable updates</FieldLabel>
            <FieldDescription>A horizontal field places the switch beside its explanation.</FieldDescription>
          </FieldContent>
          <Switch id='field-switch' />
        </Field>
        <Field orientation='responsive'>
          <FieldContent>
            <FieldLabel htmlFor='field-responsive'>Responsive label</FieldLabel>
            <FieldDescription>Resize the preview to change the arrangement.</FieldDescription>
          </FieldContent>
          <Input id='field-responsive' className='min-w-0' />
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
})

export const Validation = meta.story({
  render: () => (
    <FieldGroup className='max-w-md'>
      <Field data-invalid='true'>
        <FieldLabel htmlFor='field-error-input'>Email</FieldLabel>
        <Input id='field-error-input' aria-invalid='true' aria-describedby='field-errors' defaultValue='invalid' />
        <FieldError
          id='field-errors'
          errors={[
            { message: 'Enter a valid email address.' },
            { message: 'Use fewer than 100 characters.' },
            { message: 'Enter a valid email address.' },
          ]}
        />
      </Field>
      <Field data-disabled='true'>
        <FieldTitle>Unavailable field</FieldTitle>
        <Input disabled aria-label='Unavailable field' />
        <FieldError errors={[]} />
      </Field>
      <FieldSet>
        <FieldLegend variant='label'>Compact legend</FieldLegend>
        <FieldError>Explicit error text</FieldError>
      </FieldSet>
    </FieldGroup>
  ),
})
