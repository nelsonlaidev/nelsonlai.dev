import { describe, it } from 'vitest'

import { expectTransformedEqual } from '@/test-utils/expect-transformed-equal'

import { rewriteCnImports } from './rewrite-cn-imports'

describe('rewriteCnImports', () => {
  describe('cn imports from @/lib/utils', () => {
    it('rewrites cn import to relative path', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@/lib/utils'
        `,
        `
        import { cn } from '../utils/cn'
        `,
        rewriteCnImports
      )
    })

    it('rewrites cn import with other named imports', async () => {
      await expectTransformedEqual(
        `
        import { cn, otherUtil } from '@/lib/utils'
        `,
        `
        import { cn } from '../utils/cn'
        `,
        rewriteCnImports
      )
    })

    it('handles multiple @/lib/utils imports', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@/lib/utils'
        import { cn as cnUtil } from '@/lib/utils'
        `,
        `
        import { cn } from '../utils/cn'
        import { cn } from '../utils/cn'
        `,
        rewriteCnImports
      )
    })
  })

  describe('non-matching imports', () => {
    it('ignores imports from other paths', async () => {
      await expectTransformedEqual(
        `
        import { cn } from 'some-other-package'
        `,
        `
        import { cn } from 'some-other-package'
        `,
        rewriteCnImports
      )
    })

    it('ignores imports from similar but different paths', async () => {
      await expectTransformedEqual(
        `
        import { cn } from '@/lib/other-utils'
        `,
        `
        import { cn } from '@/lib/other-utils'
        `,
        rewriteCnImports
      )
    })

    it('preserves other imports while rewriting cn', async () => {
      await expectTransformedEqual(
        `
        import React from 'react'
        import { cn } from '@/lib/utils'
        import { Button } from './button'
        `,
        `
        import React from 'react'
        import { cn } from '../utils/cn'
        import { Button } from './button'
        `,
        rewriteCnImports
      )
    })
  })

  describe('edge cases', () => {
    it('handles file with no imports', async () => {
      await expectTransformedEqual(
        `
        const x = 1
        `,
        `
        const x = 1
        `,
        rewriteCnImports
      )
    })

    it('handles file with only non-matching imports', async () => {
      await expectTransformedEqual(
        `
        import React from 'react'
        import { Button } from './button'
        `,
        `
        import React from 'react'
        import { Button } from './button'
        `,
        rewriteCnImports
      )
    })
  })
})
