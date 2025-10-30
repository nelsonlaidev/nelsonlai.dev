import { describe, it } from 'vitest'

import { expectTransformedEqual } from '@/test-utils/expect-transformed-equal'

import { rewriteReactImports } from './rewrite-react-imports'

describe('rewriteReactImports', () => {
  describe('namespace imports with usage', () => {
    it('rewrites namespace import with single React function', async () => {
      await expectTransformedEqual(
        `
        import * as React from 'react'
        const [state, setState] = React.useState(0)
        `,
        `
        import { useState } from 'react'
        const [state, setState] = useState(0)
        `,
        rewriteReactImports
      )
    })

    it('rewrites namespace import with multiple React functions', async () => {
      await expectTransformedEqual(
        `
        import * as React from 'react'
        const [state, setState] = React.useState(0)
        React.useEffect(() => {}, [])
        const ref = React.useRef(null)
        `,
        `
        import { useState, useEffect, useRef } from 'react'
        const [state, setState] = useState(0)
        useEffect(() => {}, [])
        const ref = useRef(null)
        `,
        rewriteReactImports
      )
    })

    it('handles duplicate React function calls', async () => {
      await expectTransformedEqual(
        `
        import * as React from 'react'
        const [state1, setState1] = React.useState(0)
        const [state2, setState2] = React.useState(1)
        `,
        `
        import { useState } from 'react'
        const [state1, setState1] = useState(0)
        const [state2, setState2] = useState(1)
        `,
        rewriteReactImports
      )
    })
  })

  describe('namespace imports without usage', () => {
    it('removes namespace import when no React functions are used', async () => {
      await expectTransformedEqual(
        `
        import * as React from 'react'
        `,
        ``,
        rewriteReactImports
      )
    })
  })

  describe('non-react imports', () => {
    it('ignores non-react imports', async () => {
      await expectTransformedEqual(
        `
        import * as React from 'react'
        import { something } from 'other-package'
        React.useState(0)
        `,
        `
        import { useState } from 'react'
        import { something } from 'other-package'
        useState(0)
        `,
        rewriteReactImports
      )
    })
  })

  describe('mixed scenarios', () => {
    it('handles component with multiple hooks', async () => {
      await expectTransformedEqual(
        `
        import * as React from 'react'

        const Component = () => {
          const [count, setCount] = React.useState(0)
          const ref = React.useRef(null)

          React.useEffect(() => {
            console.log(count)
          }, [count])

          return null
        }
        `,
        `
        import { useState, useRef, useEffect } from 'react'

        const Component = () => {
          const [count, setCount] = useState(0)
          const ref = useRef(null)

          useEffect(() => {
            console.log(count)
          }, [count])

          return null
        }
        `,
        rewriteReactImports
      )
    })
  })
})
