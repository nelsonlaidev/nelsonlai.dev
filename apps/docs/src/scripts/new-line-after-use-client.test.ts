import { describe, it } from 'vitest'

import { expectTransformedEqual } from '@/test-utils/expect-transformed-equal'

import { newLineAfterUseClient } from './new-line-after-use-client'

describe('newLineAfterUseClient', () => {
  describe('use client directive', () => {
    it('adds blank line after use client directive', async () => {
      await expectTransformedEqual(
        `
        'use client'
        import { useState } from 'react'
        `,
        `
        'use client'

        import { useState } from 'react'
        `,
        newLineAfterUseClient
      )
    })

    it('adds blank line after use client with multiple imports', async () => {
      await expectTransformedEqual(
        `
        'use client'
        import { useState } from 'react'
        import { Button } from './button'
        `,
        `
        'use client'

        import { useState } from 'react'
        import { Button } from './button'
        `,
        newLineAfterUseClient
      )
    })

    it('adds blank line after use client with code', async () => {
      await expectTransformedEqual(
        `
        'use client'
        const x = 1
        `,
        `
        'use client'

        const x = 1
        `,
        newLineAfterUseClient
      )
    })

    it('adds blank line after use client with function', async () => {
      await expectTransformedEqual(
        `
        'use client'
        function Component() {
          return <div>Hello</div>
        }
        `,
        `
        'use client'

        function Component() {
          return <div>Hello</div>
        }
        `,
        newLineAfterUseClient
      )
    })
  })

  describe('already has blank line', () => {
    it('does not add extra blank line when one already exists', async () => {
      await expectTransformedEqual(
        `
        'use client'

        import { useState } from 'react'
        `,
        `
        'use client'

        import { useState } from 'react'
        `,
        newLineAfterUseClient
      )
    })

    it('does not add extra blank line with multiple existing blank lines', async () => {
      await expectTransformedEqual(
        `
        'use client'


        import { useState } from 'react'
        `,
        `
        'use client'

        import { useState } from 'react'
        `,
        newLineAfterUseClient
      )
    })
  })

  describe('non-matching patterns', () => {
    it('ignores files without use client directive', async () => {
      await expectTransformedEqual(
        `
        import { useState } from 'react'
        `,
        `
        import { useState } from 'react'
        `,
        newLineAfterUseClient
      )
    })

    it('ignores use server directive', async () => {
      await expectTransformedEqual(
        `
        'use server'
        import { db } from './db'
        `,
        `
        'use server'
        import { db } from './db'
        `,
        newLineAfterUseClient
      )
    })

    it('ignores use strict directive', async () => {
      await expectTransformedEqual(
        `
        'use strict'
        const x = 1
        `,
        `
        'use strict'
        const x = 1
        `,
        newLineAfterUseClient
      )
    })

    it('ignores use client in comments', async () => {
      await expectTransformedEqual(
        `
        // 'use client'
        import { useState } from 'react'
        `,
        `
        // 'use client'
        import { useState } from 'react'
        `,
        newLineAfterUseClient
      )
    })
  })

  describe('edge cases', () => {
    it('handles empty file', async () => {
      await expectTransformedEqual(
        `
        `,
        `
        `,
        newLineAfterUseClient
      )
    })

    it('handles file with only use client directive', async () => {
      await expectTransformedEqual(
        `
        'use client'
        `,
        `
        'use client'
        `,
        newLineAfterUseClient
      )
    })

    it('handles use client with single newline', async () => {
      await expectTransformedEqual(
        `
        'use client'
        `,
        `
        'use client'
        `,
        newLineAfterUseClient
      )
    })

    it('preserves leading comments before use client', async () => {
      await expectTransformedEqual(
        `
        // Copyright notice
        'use client'
        import { useState } from 'react'
        `,
        `
        // Copyright notice
        'use client'

        import { useState } from 'react'
        `,
        newLineAfterUseClient
      )
    })
  })
})
