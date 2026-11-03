import type { Meta, StoryObj } from '@storybook/react-vite'

import { Label } from '@repo/ui/components/label'
import { Switch } from '@repo/ui/components/switch'
import { useState } from 'react'

const meta = {
  title: 'Actions and forms/Switch',
  parameters: {
    docs: {
      description: {
        component:
          'Import { Switch } from @repo/ui/components/switch. Supports sm/default sizes, controlled or defaultChecked state, disabled, and invalid state. Each switch needs a label; Space toggles it.',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj

export const SizesAndStates: Story = {
  render: () => (
    <div className='space-y-5'>
      {(['sm', 'default'] as const).map((size) => (
        <div key={size} className='flex items-center gap-3'>
          <Switch id={`switch-${size}`} size={size} />
          <Label htmlFor={`switch-${size}`}>{size} size</Label>
        </div>
      ))}
      <div className='flex items-center gap-3'>
        <Switch id='switch-disabled' disabled defaultChecked />
        <Label htmlFor='switch-disabled'>Disabled and checked</Label>
      </div>
      <div className='flex items-center gap-3'>
        <Switch id='switch-invalid' aria-invalid='true' />
        <Label htmlFor='switch-invalid'>Invalid</Label>
      </div>
    </div>
  ),
}

function ControlledSwitch() {
  const [checked, setChecked] = useState(false)

  return (
    <div className='flex items-center gap-3'>
      <Switch id='switch-controlled' checked={checked} onCheckedChange={setChecked} />
      <Label htmlFor='switch-controlled'>Local preference: {checked ? 'on' : 'off'}</Label>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledSwitch />,
}
