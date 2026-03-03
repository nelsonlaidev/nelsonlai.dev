'use client'

import { CodeBlock } from './code-block'
import { Demo, DemoItem } from './demo'

const tsxSnippet = `\
type ButtonProps = {
  label: string
  onClick: () => void
}

export function PrimaryButton({ label, onClick }: ButtonProps) {
  return (
    <button className='rounded-lg bg-primary px-4 py-2 text-primary-foreground' onClick={onClick}>
      {label}
    </button>
  )
}
`

const bashSnippet = `pnpm install
pnpm dev
pnpm lint
pnpm test
`

export default function CodeBlockDemo() {
  return (
    <Demo title='Code Block'>
      <CodeBlockBasic />
      <CodeBlockWithTitle />
    </Demo>
  )
}

function CodeBlockBasic() {
  return (
    <DemoItem title='Basic' className='justify-center'>
      <CodeBlock data-lang='bash' figureClassName='w-full max-w-lg'>
        <code>{bashSnippet}</code>
      </CodeBlock>
    </DemoItem>
  )
}

function CodeBlockWithTitle() {
  return (
    <DemoItem title='With Title' className='justify-center'>
      <CodeBlock data-lang='tsx' title='components/primary-button.tsx'>
        <code>{tsxSnippet}</code>
      </CodeBlock>
    </DemoItem>
  )
}
