import fs from 'node:fs/promises'

import { Pre } from 'fumadocs-ui/components/codeblock'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { codeToHast } from 'shiki'

import ComponentPreviewTabs from './component-preview-tabs'

type ComponentPreviewProps = {
  name: string
}

const ComponentPreview = async (props: ComponentPreviewProps) => {
  const { name } = props

  const COMPONENT_PATH = `src/components/demos/${name}`

  const componentModule = await import(COMPONENT_PATH)
  const Component = componentModule.default

  const sourceCode = await fs.readFile(`${COMPONENT_PATH}.tsx`, 'utf8')
  const sourceHast = await codeToHast(sourceCode, {
    lang: 'tsx',
    themes: {
      light: 'github-light',
      dark: 'github-dark'
    },
    defaultColor: false,
    transformers: [
      {
        preprocess: (code) => code.replace(/\n$/, '')
      }
    ]
  })
  const source = toJsxRuntime(sourceHast, {
    Fragment,
    jsx,
    jsxs,
    components: {
      pre: (p) => <Pre {...p} />
    }
  })

  return <ComponentPreviewTabs preview={<Component />} source={source} />
}

export default ComponentPreview
