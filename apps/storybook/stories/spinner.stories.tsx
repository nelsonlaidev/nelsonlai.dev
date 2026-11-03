import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@repo/ui/components/button'
import { Spinner } from '@repo/ui/components/spinner'

const meta = {
  title: 'Data and display/Spinner',
  parameters: {
    docs: {
      description: {
        component:
          'Import { Spinner } from @repo/ui/components/spinner. Uses the UIProvider loading translation by default. Override aria-label for a specific operation; use aria-hidden when adjacent text supplies the status.',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj

export const LabelsAndSizes: Story = {
  render: () => (
    <div className='flex items-center gap-6'>
      <Spinner />
      <Spinner aria-label='Preparing preview' className='size-8' />
      <Button disabled aria-busy='true'>
        <Spinner aria-hidden='true' />
        Saving
      </Button>
    </div>
  ),
}
