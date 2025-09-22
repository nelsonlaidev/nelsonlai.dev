import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Hero from '@/components/home/hero'
import { MY_NAME } from '@/lib/constants'
import { render } from '@/utils/render'

describe('<Hero />', () => {
  it('should have a hero image', () => {
    render(<Hero />)

    expect(screen.getByAltText(`${MY_NAME}'s Logo`)).toBeInTheDocument()
  })
})
