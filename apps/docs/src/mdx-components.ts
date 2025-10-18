import type { MDXComponents } from 'mdx/types'

import defaultMdxComponents from 'fumadocs-ui/mdx'

export const getMDXComponents = (components?: MDXComponents): MDXComponents => {
  return {
    ...defaultMdxComponents,
    ...components
  }
}
