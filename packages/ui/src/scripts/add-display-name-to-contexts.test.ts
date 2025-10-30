import { describe, it } from 'vitest'

import { expectTransformedEqual } from '@/test-utils/expect-transformed-equal'

import { addDisplayNameToContexts } from './add-display-name-to-contexts'

describe('addDisplayNameToContexts', () => {
  describe('createContext calls', () => {
    it('adds displayName to context created with createContext', async () => {
      await expectTransformedEqual(
        `
        const MyContext = createContext(null)
        `,
        `
        const MyContext = createContext(null)
        MyContext.displayName = 'MyContext'
        `,
        addDisplayNameToContexts
      )
    })

    it('adds displayName to context with default value', async () => {
      await expectTransformedEqual(
        `
        const ThemeContext = createContext({ theme: 'light' })
        `,
        `
        const ThemeContext = createContext({ theme: 'light' })
        ThemeContext.displayName = 'ThemeContext'
        `,
        addDisplayNameToContexts
      )
    })

    it('adds displayName to context with undefined', async () => {
      await expectTransformedEqual(
        `
        const UserContext = createContext(undefined)
        `,
        `
        const UserContext = createContext(undefined)
        UserContext.displayName = 'UserContext'
        `,
        addDisplayNameToContexts
      )
    })

    it('adds displayName to multiple contexts', async () => {
      await expectTransformedEqual(
        `
        const FirstContext = createContext(null)
        const SecondContext = createContext(null)
        `,
        `
        const FirstContext = createContext(null)
        FirstContext.displayName = 'FirstContext'
        const SecondContext = createContext(null)
        SecondContext.displayName = 'SecondContext'
        `,
        addDisplayNameToContexts
      )
    })

    it('adds displayName to context with type annotation', async () => {
      await expectTransformedEqual(
        `
        const MyContext: React.Context<string | null> = createContext(null)
        `,
        `
        const MyContext: React.Context<string | null> = createContext(null)
        MyContext.displayName = 'MyContext'
        `,
        addDisplayNameToContexts
      )
    })
  })

  describe('existing displayName', () => {
    it('does not add duplicate displayName when already exists', async () => {
      await expectTransformedEqual(
        `
        const MyContext = createContext(null)
        MyContext.displayName = 'MyContext'
        `,
        `
        const MyContext = createContext(null)
        MyContext.displayName = 'MyContext'
        `,
        addDisplayNameToContexts
      )
    })

    it('does not add displayName when custom displayName exists', async () => {
      await expectTransformedEqual(
        `
        const MyContext = createContext(null)
        MyContext.displayName = 'CustomName'
        `,
        `
        const MyContext = createContext(null)
        MyContext.displayName = 'CustomName'
        `,
        addDisplayNameToContexts
      )
    })

    it('handles multiple contexts with some having displayName', async () => {
      await expectTransformedEqual(
        `
        const FirstContext = createContext(null)
        FirstContext.displayName = 'FirstContext'
        const SecondContext = createContext(null)
        `,
        `
        const FirstContext = createContext(null)
        FirstContext.displayName = 'FirstContext'
        const SecondContext = createContext(null)
        SecondContext.displayName = 'SecondContext'
        `,
        addDisplayNameToContexts
      )
    })
  })

  describe('non-matching patterns', () => {
    it('ignores non-createContext function calls', async () => {
      await expectTransformedEqual(
        `
        const myValue = someOtherFunction(null)
        `,
        `
        const myValue = someOtherFunction(null)
        `,
        addDisplayNameToContexts
      )
    })

    it('ignores createContext from different imports', async () => {
      await expectTransformedEqual(
        `
        import { createContext } from 'some-other-library'
        const MyContext = createContext(null)
        `,
        `
        import { createContext } from 'some-other-library'
        const MyContext = createContext(null)
        MyContext.displayName = 'MyContext'
        `,
        addDisplayNameToContexts
      )
    })

    it('ignores variables not initialized with function calls', async () => {
      await expectTransformedEqual(
        `
        const myValue = null
        const myObject = { key: 'value' }
        `,
        `
        const myValue = null
        const myObject = { key: 'value' }
        `,
        addDisplayNameToContexts
      )
    })

    it('preserves other code while adding displayName', async () => {
      await expectTransformedEqual(
        `
        import { createContext } from 'react'

        const MyContext = createContext(null)

        export const useMyContext = () => {
          return useContext(MyContext)
        }
        `,
        `
        import { createContext } from 'react'

        const MyContext = createContext(null)
        MyContext.displayName = 'MyContext'

        export const useMyContext = () => {
          return useContext(MyContext)
        }
        `,
        addDisplayNameToContexts
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
        addDisplayNameToContexts
      )
    })

    it('handles file with no variable declarations', async () => {
      await expectTransformedEqual(
        `
        export function myFunction() {
          return null
        }
        `,
        `
        export function myFunction() {
          return null
        }
        `,
        addDisplayNameToContexts
      )
    })

    it('handles context with complex default value', async () => {
      await expectTransformedEqual(
        `
        const MyContext = createContext({
          user: null,
          setUser: () => {}
        })
        `,
        `
        const MyContext = createContext({
          user: null,
          setUser: () => {}
        })
        MyContext.displayName = 'MyContext'
        `,
        addDisplayNameToContexts
      )
    })

    it('handles context created in exported statement', async () => {
      await expectTransformedEqual(
        `
        export const MyContext = createContext(null)
        `,
        `
        export const MyContext = createContext(null)
        MyContext.displayName = 'MyContext'
        `,
        addDisplayNameToContexts
      )
    })
  })
})
