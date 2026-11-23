import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select'
import { useState } from 'react'

import preview from '../.storybook/preview'

const meta = preview.meta({
  title: 'Components/Select',
  component: SelectExample,
})

type SelectExampleProps = {
  size?: 'sm' | 'default'
  disabled?: boolean
  invalid?: boolean
  long?: boolean
}

function SelectExample(props: SelectExampleProps) {
  const { size = 'default', disabled = false, invalid = false, long = false } = props
  const [value, setValue] = useState<string | null>(null)

  return (
    <div className='max-w-sm space-y-3'>
      <Select value={value} onValueChange={setValue} disabled={disabled}>
        <SelectTrigger size={size} aria-label='Choose a component' aria-invalid={invalid}>
          <SelectValue placeholder='Choose a component' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Controls</SelectLabel>
            {(long
              ? Array.from({ length: 30 }, (_, index) => `Component ${index + 1}`)
              : ['Button', 'Input', 'Select']
            ).map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Unavailable</SelectLabel>
            <SelectItem value='disabled' disabled>
              Disabled item
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <p className='text-sm text-muted-foreground'>Selected: {value ?? 'none'}</p>
    </div>
  )
}

export const Controlled = meta.story()

export const Small = meta.story({ args: { size: 'sm' } })

export const Disabled = meta.story({ args: { disabled: true } })

export const Invalid = meta.story({ args: { invalid: true } })

export const Scrollable = meta.story({ args: { long: true } })
