import { describe, it } from 'vitest'

import { expectTransformedEqual } from '@/test-utils/expect-transformed-equal'

import { insert2aBeforeFunctions } from './insert-2a-before-functions'

describe('insert2aBeforeFunctions', () => {
  describe('basic function declarations', () => {
    it('inserts /// 2a before a single function', async () => {
      await expectTransformedEqual(
        `
        function myFunction() {
          return 'hello'
        }
        `,
        `
        /// 2a
        function myFunction() {
          return 'hello'
        }
        `,
        insert2aBeforeFunctions
      )
    })

    it('inserts /// 2a before multiple functions', async () => {
      await expectTransformedEqual(
        `
        function first() {
          return 1
        }

        function second() {
          return 2
        }

        function third() {
          return 3
        }
        `,
        `
        /// 2a
        function first() {
          return 1
        }

        /// 2a
        function second() {
          return 2
        }

        /// 2a
        function third() {
          return 3
        }
        `,
        insert2aBeforeFunctions
      )
    })

    it('inserts /// 2a before function with parameters', async () => {
      await expectTransformedEqual(
        `
        function add(a: number, b: number) {
          return a + b
        }
        `,
        `
        /// 2a
        function add(a: number, b: number) {
          return a + b
        }
        `,
        insert2aBeforeFunctions
      )
    })

    it('inserts /// 2a before function with return type', async () => {
      await expectTransformedEqual(
        `
        function getValue(): string {
          return 'value'
        }
        `,
        `
        /// 2a
        function getValue(): string {
          return 'value'
        }
        `,
        insert2aBeforeFunctions
      )
    })
  })

  describe('functions with existing comments', () => {
    it('does not duplicate /// 2a if already present', async () => {
      await expectTransformedEqual(
        `
        /// 2a
        function myFunction() {
          return 'hello'
        }
        `,
        `
        /// 2a
        function myFunction() {
          return 'hello'
        }
        `,
        insert2aBeforeFunctions
      )
    })

    it('does not duplicate /// 2a with extra whitespace', async () => {
      await expectTransformedEqual(
        `
        ///   2a
        function myFunction() {
          return 'hello'
        }
        `,
        `
        ///   2a
        function myFunction() {
          return 'hello'
        }
        `,
        insert2aBeforeFunctions
      )
    })

    it('inserts /// 2a before function with JSDoc comment', async () => {
      await expectTransformedEqual(
        `
        /**
         * This is a JSDoc comment
         */
        function myFunction() {
          return 'hello'
        }
        `,
        `
        /**
         * This is a JSDoc comment
         */
        /// 2a
        function myFunction() {
          return 'hello'
        }
        `,
        insert2aBeforeFunctions
      )
    })

    it('inserts /// 2a before function with regular comment', async () => {
      await expectTransformedEqual(
        `
        // This is a regular comment
        function myFunction() {
          return 'hello'
        }
        `,
        `
        // This is a regular comment
        /// 2a
        function myFunction() {
          return 'hello'
        }
        `,
        insert2aBeforeFunctions
      )
    })
  })

  describe('exported functions', () => {
    it('inserts /// 2a before exported function', async () => {
      await expectTransformedEqual(
        `
        export function myFunction() {
          return 'hello'
        }
        `,
        `
        /// 2a
        export function myFunction() {
          return 'hello'
        }
        `,
        insert2aBeforeFunctions
      )
    })

    it('inserts /// 2a before default exported function', async () => {
      await expectTransformedEqual(
        `
        export default function myFunction() {
          return 'hello'
        }
        `,
        `
        /// 2a
        export default function myFunction() {
          return 'hello'
        }
        `,
        insert2aBeforeFunctions
      )
    })
  })

  describe('async and generator functions', () => {
    it('inserts /// 2a before async function', async () => {
      await expectTransformedEqual(
        `
        async function fetchData() {
          return await Promise.resolve('data')
        }
        `,
        `
        /// 2a
        async function fetchData() {
          return await Promise.resolve('data')
        }
        `,
        insert2aBeforeFunctions
      )
    })

    it('inserts /// 2a before generator function', async () => {
      await expectTransformedEqual(
        `
        function* generator() {
          yield 1
          yield 2
        }
        `,
        `
        /// 2a
        function* generator() {
          yield 1
          yield 2
        }
        `,
        insert2aBeforeFunctions
      )
    })
  })

  describe('edge cases', () => {
    it('handles file with no functions', async () => {
      await expectTransformedEqual(
        `
        const x = 1
        const y = 2
        `,
        `
        const x = 1
        const y = 2
        `,
        insert2aBeforeFunctions
      )
    })

    it('ignores arrow functions', async () => {
      await expectTransformedEqual(
        `
        const myArrow = () => {
          return 'hello'
        }
        `,
        `
        const myArrow = () => {
          return 'hello'
        }
        `,
        insert2aBeforeFunctions
      )
    })

    it('ignores function expressions', async () => {
      await expectTransformedEqual(
        `
        const myFunc = function () {
          return 'hello'
        }
        `,
        `
        const myFunc = function () {
          return 'hello'
        }
        `,
        insert2aBeforeFunctions
      )
    })

    it('handles mixed declarations and expressions', async () => {
      await expectTransformedEqual(
        `
        function declared() {
          return 'declared'
        }

        const arrow = () => 'arrow'

        const expression = function () {
          return 'expression'
        }
        `,
        `
        /// 2a
        function declared() {
          return 'declared'
        }

        const arrow = () => 'arrow'

        const expression = function () {
          return 'expression'
        }
        `,
        insert2aBeforeFunctions
      )
    })
  })
})
