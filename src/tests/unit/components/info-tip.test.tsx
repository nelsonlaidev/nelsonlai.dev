import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { InfoTip } from '@/components/ui/info-tip'

describe('<InfoTip />', () => {
  test('opens on hover', async () => {
    expect.assertions(1)

    render(
      <InfoTip label='Location information' content='Location may not be accurate'>
        <span aria-hidden>i</span>
      </InfoTip>,
    )

    const trigger = screen.getByRole('button', { name: 'Location information' })
    fireEvent.pointerEnter(trigger, { pointerType: 'mouse' })
    fireEvent.mouseEnter(trigger)
    fireEvent.mouseMove(trigger)

    expect(await screen.findByRole('dialog', { name: 'Location information' })).toHaveAccessibleDescription(
      'Location may not be accurate',
    )
  })

  test('opens on click and closes with Escape, returning focus to the trigger', async () => {
    expect.assertions(3)

    render(
      <InfoTip label='Location information' content='Location may not be accurate'>
        <span aria-hidden>i</span>
      </InfoTip>,
    )

    const trigger = screen.getByRole('button', { name: 'Location information' })
    fireEvent.click(trigger)

    const popup = await screen.findByRole('dialog', { name: 'Location information' })
    expect(popup).toHaveAccessibleDescription('Location may not be accurate')

    fireEvent.keyDown(popup, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    await waitFor(() => {
      expect(trigger).toHaveFocus()
    })
  })
})
