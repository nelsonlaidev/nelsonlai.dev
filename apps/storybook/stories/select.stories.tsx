import type { Meta, StoryObj } from '@storybook/react-vite'

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

const meta = {
  title: 'Actions and forms/Select',
  parameters: {
    docs: {
      description: {
        component:
          'Import the Select* parts from @repo/ui/components/select. SelectContent includes portal, positioning, and scroll arrows. Use the keyboard to open, type ahead, navigate, and choose. Provide a trigger label and item values.',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj

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

export const Controlled: Story = {
  render: () => <SelectExample />,
}

export const Small: Story = {
  render: () => <SelectExample size='sm' />,
}

export const Disabled: Story = {
  render: () => <SelectExample disabled />,
}

export const Invalid: Story = {
  render: () => <SelectExample invalid />,
}

export const Scrollable: Story = {
  render: () => <SelectExample long />,
}
