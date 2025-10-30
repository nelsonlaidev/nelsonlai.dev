import { describe, it } from 'vitest'

import { expectTransformedEqual } from '@/test-utils/expect-transformed-equal'

import { rewriteDestructuredParams } from './rewrite-destructured-params'

describe('rewriteDestructuredParams', () => {
  describe('basic destructuring', () => {
    it('rewrites destructured params to props object', async () => {
      await expectTransformedEqual(
        `
        function Button({ className, children }: ButtonProps) {
          return <button className={className}>{children}</button>
        }
        `,
        `
        function Button(props: ButtonProps) {
          const { className, children } = props

          return <button className={className}>{children}</button>
        }
        `,
        rewriteDestructuredParams
      )
    })

    it('rewrites destructured params with spread', async () => {
      await expectTransformedEqual(
        `
        function Button({ className, ...props }: ButtonProps) {
          return <button className={className} {...props} />
        }
        `,
        `
        function Button(props: ButtonProps) {
          const { className, ...rest } = props

          return <button className={className} {...rest} />
        }
        `,
        rewriteDestructuredParams
      )
    })

    it('handles only spread props', async () => {
      await expectTransformedEqual(
        `
        function Button({ ...props }: ButtonProps) {
          return <button {...props} />
        }
        `,
        `
        function Button(props: ButtonProps) {
          return <button {...props} />
        }
        `,
        rewriteDestructuredParams
      )
    })
  })

  describe('multiple components', () => {
    it('rewrites multiple component functions', async () => {
      await expectTransformedEqual(
        `
        function Button({ className }: ButtonProps) {
          return <button className={className} />
        }

        function Card({ title }: CardProps) {
          return <div>{title}</div>
        }
        `,
        `
        function Button(props: ButtonProps) {
          const { className } = props

          return <button className={className} />
        }

        function Card(props: CardProps) {
          const { title } = props

          return <div>{title}</div>
        }
        `,
        rewriteDestructuredParams
      )
    })
  })

  describe('non-component functions', () => {
    it('ignores non-JSX returning functions', async () => {
      await expectTransformedEqual(
        `
        function helper({ value }: HelperProps) {
          return value * 2
        }
        `,
        `
        function helper({ value }: HelperProps) {
          return value * 2
        }
        `,
        rewriteDestructuredParams
      )
    })
  })

  describe('non-destructured params', () => {
    it('ignores already non-destructured params', async () => {
      await expectTransformedEqual(
        `
        function Button(props: ButtonProps) {
          return <button {...props} />
        }
        `,
        `
        function Button(props: ButtonProps) {
          return <button {...props} />
        }
        `,
        rewriteDestructuredParams
      )
    })
  })

  describe('complex destructuring patterns', () => {
    it('handles nested destructuring', async () => {
      await expectTransformedEqual(
        `
        function Component({ className, size, variant, ...props }: ComponentProps) {
          return <div className={className} {...props} />
        }
        `,
        `
        function Component(props: ComponentProps) {
          const { className, size, variant, ...rest } = props

          return <div className={className} {...rest} />
        }
        `,
        rewriteDestructuredParams
      )
    })
  })

  describe('edge cases', () => {
    it('handles file with no functions', async () => {
      await expectTransformedEqual(
        `
        const x = 1
        `,
        `
        const x = 1
        `,
        rewriteDestructuredParams
      )
    })

    it('handles JSX fragments', async () => {
      await expectTransformedEqual(
        `
        function Component({ children }: ComponentProps) {
          return <>{children}</>
        }
        `,
        `
        function Component(props: ComponentProps) {
          const { children } = props

          return <>{children}</>
        }
        `,
        rewriteDestructuredParams
      )
    })

    it('handles self-closing JSX elements', async () => {
      await expectTransformedEqual(
        `
        function Component({ className }: ComponentProps) {
          return <div className={className} />
        }
        `,
        `
        function Component(props: ComponentProps) {
          const { className } = props

          return <div className={className} />
        }
        `,
        rewriteDestructuredParams
      )
    })
  })
})
