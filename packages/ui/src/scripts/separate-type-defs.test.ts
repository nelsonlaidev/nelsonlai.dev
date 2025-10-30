import { describe, it } from 'vitest'

import { expectTransformedEqual } from '@/test-utils/expect-transformed-equal'

import { separateTypeDefs } from './separate-type-defs'

describe('separateTypeDefs', () => {
  describe('basic type separation', () => {
    it('separates inline type definition to type alias', async () => {
      await expectTransformedEqual(
        `
        function Component(props: React.ComponentProps<typeof SomeOtherComponent>) {
          return <div>{props.children}</div>
        }
        `,
        `
        type ComponentProps = React.ComponentProps<typeof SomeOtherComponent>

        function Component(props: ComponentProps) {
          return <div>{props.children}</div>
        }
        `,
        separateTypeDefs
      )
    })

    it('separates complex type definition', async () => {
      await expectTransformedEqual(
        `
        function Button(props: { className?: string; onClick?: () => void }) {
          return <button className={props.className} onClick={props.onClick} />
        }
        `,
        `
        type ButtonProps = { className?: string; onClick?: () => void }

        function Button(props: ButtonProps) {
          return <button className={props.className} onClick={props.onClick} />
        }
        `,
        separateTypeDefs
      )
    })

    it('separates union type definition', async () => {
      await expectTransformedEqual(
        `
        function Component(props: BaseProps & { extra: string }) {
          return <div>{props.extra}</div>
        }
        `,
        `
        type ComponentProps = BaseProps & { extra: string }

        function Component(props: ComponentProps) {
          return <div>{props.extra}</div>
        }
        `,
        separateTypeDefs
      )
    })
  })

  describe('multiple functions', () => {
    it('separates type definitions for multiple functions', async () => {
      await expectTransformedEqual(
        `
        function Button(props: React.ComponentProps<'button'>) {
          return <button {...props} />
        }

        function Card(props: React.ComponentProps<'div'>) {
          return <div {...props} />
        }
        `,
        `
        type ButtonProps = React.ComponentProps<'button'>

        function Button(props: ButtonProps) {
          return <button {...props} />
        }

        type CardProps = React.ComponentProps<'div'>

        function Card(props: CardProps) {
          return <div {...props} />
        }
        `,
        separateTypeDefs
      )
    })
  })

  describe('non-matching patterns', () => {
    it('ignores functions with already separated type alias', async () => {
      await expectTransformedEqual(
        `
        type ComponentProps = React.ComponentProps<'div'>

        function Component(props: ComponentProps) {
          return <div {...props} />
        }
        `,
        `
        type ComponentProps = React.ComponentProps<'div'>

        function Component(props: ComponentProps) {
          return <div {...props} />
        }
        `,
        separateTypeDefs
      )
    })

    it('ignores functions with non-props parameter name', async () => {
      await expectTransformedEqual(
        `
        function Component(config: React.ComponentProps<'div'>) {
          return <div {...config} />
        }
        `,
        `
        function Component(config: React.ComponentProps<'div'>) {
          return <div {...config} />
        }
        `,
        separateTypeDefs
      )
    })

    it('ignores functions with multiple parameters', async () => {
      await expectTransformedEqual(
        `
        function Component(props: ComponentProps, ref: React.Ref<HTMLDivElement>) {
          return <div ref={ref} {...props} />
        }
        `,
        `
        function Component(props: ComponentProps, ref: React.Ref<HTMLDivElement>) {
          return <div ref={ref} {...props} />
        }
        `,
        separateTypeDefs
      )
    })

    it('ignores functions with no parameters', async () => {
      await expectTransformedEqual(
        `
        function Component() {
          return <div>Hello</div>
        }
        `,
        `
        function Component() {
          return <div>Hello</div>
        }
        `,
        separateTypeDefs
      )
    })

    it('ignores functions with no type annotation', async () => {
      await expectTransformedEqual(
        `
        function Component(props) {
          return <div {...props} />
        }
        `,
        `
        function Component(props) {
          return <div {...props} />
        }
        `,
        separateTypeDefs
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
        separateTypeDefs
      )
    })

    it('handles generic type parameters', async () => {
      await expectTransformedEqual(
        `
        function Component(props: React.ComponentProps<typeof GenericComponent<string>>) {
          return <div>{props.value}</div>
        }
        `,
        `
        type ComponentProps = React.ComponentProps<typeof GenericComponent<string>>

        function Component(props: ComponentProps) {
          return <div>{props.value}</div>
        }
        `,
        separateTypeDefs
      )
    })

    it('preserves function body and other code', async () => {
      await expectTransformedEqual(
        `
        function Component(props: { value: number }) {
          const doubled = props.value * 2
          return <div>{doubled}</div>
        }
        `,
        `
        type ComponentProps = { value: number }

        function Component(props: ComponentProps) {
          const doubled = props.value * 2
          return <div>{doubled}</div>
        }
        `,
        separateTypeDefs
      )
    })

    it('handles functions with complex return types', async () => {
      await expectTransformedEqual(
        `
        function Component(props: React.ComponentProps<'div'>): JSX.Element {
          return <div {...props} />
        }
        `,
        `
        type ComponentProps = React.ComponentProps<'div'>

        function Component(props: ComponentProps): JSX.Element {
          return <div {...props} />
        }
        `,
        separateTypeDefs
      )
    })
  })

  describe('naming conventions', () => {
    it('creates type alias with Props suffix', async () => {
      await expectTransformedEqual(
        `
        function MyButton(props: React.ComponentProps<'button'>) {
          return <button {...props} />
        }
        `,
        `
        type MyButtonProps = React.ComponentProps<'button'>

        function MyButton(props: MyButtonProps) {
          return <button {...props} />
        }
        `,
        separateTypeDefs
      )
    })

    it('handles PascalCase function names', async () => {
      await expectTransformedEqual(
        `
        function CustomComponent(props: { value: string }) {
          return <div>{props.value}</div>
        }
        `,
        `
        type CustomComponentProps = { value: string }

        function CustomComponent(props: CustomComponentProps) {
          return <div>{props.value}</div>
        }
        `,
        separateTypeDefs
      )
    })
  })
})
