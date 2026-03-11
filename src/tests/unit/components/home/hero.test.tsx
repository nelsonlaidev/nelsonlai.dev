import { screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { Hero } from '@/components/home/hero'
import { MY_NAME } from '@/constants/site'
import { render } from '@/utils/render'

describe('<Hero />', () => {
  test('has a hero image', () => {
    expect.assertions(1)

    render(<Hero />)

    expect(screen.getByAltText(`${MY_NAME}'s Logo`)).toBeInTheDocument()
  })
})
