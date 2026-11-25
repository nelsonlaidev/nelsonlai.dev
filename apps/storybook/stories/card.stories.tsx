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

import preview from '../.storybook/preview'

const meta = preview.meta({
  title: 'Components/Card',
})

export const SizesAndAnatomy = meta.story({
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
})

export const WithImage = meta.story({
  render: () => (
    <Card className='max-w-sm'>
      <img src='/reef.svg' alt='Illustrated reef' />
      <CardHeader>
        <CardTitle>Reef study</CardTitle>
        <CardDescription>A direct image child sits flush against the top edge.</CardDescription>
      </CardHeader>
    </Card>
  ),
})
