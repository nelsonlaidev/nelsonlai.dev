import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@repo/ui/components/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card'

const meta = {
  title: 'Structure and navigation/Card',
  parameters: {
    docs: {
      description: {
        component:
          'Import the Card* parts from @repo/ui/components/card. Supports default and sm spacing. CardAction occupies the header action column; direct first/last images receive edge treatment.',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj

export const SizesAndAnatomy: Story = {
  render: () => (
    <div className='grid max-w-3xl gap-6 sm:grid-cols-2'>
      {(['default', 'sm'] as const).map((size) => (
        <Card key={size} size={size}>
          <CardHeader>
            <CardTitle>{size} card</CardTitle>
            <CardDescription>A longer description that wraps comfortably across a narrow card.</CardDescription>
            <CardAction>
              <Button variant='ghost' size='sm'>
                Edit
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>Use a card to group related content and its actions.</CardContent>
          <CardFooter className='border-t'>
            <Button variant='outline'>Local action</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  ),
}

export const WithImage: Story = {
  render: () => (
    <Card className='max-w-sm'>
      <img src='/reef.svg' alt='Illustrated reef' />
      <CardHeader>
        <CardTitle>Reef study</CardTitle>
        <CardDescription>A direct image child sits flush against the top edge.</CardDescription>
      </CardHeader>
    </Card>
  ),
}
