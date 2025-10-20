import type { MDXComponents } from 'mdx/types'

import defaultMdxComponents from 'fumadocs-ui/mdx'

import ComponentPreview from '@/components/component-preview'

import ComponentPreviewEmbed from './components/component-preview-embed'

export const getMDXComponents = (components?: MDXComponents): MDXComponents => {
  return {
    ...defaultMdxComponents,
    ...components,
    ComponentPreview,
    ComponentPreviewEmbed
  }
}
