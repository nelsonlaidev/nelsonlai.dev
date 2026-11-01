import type { MdxModule } from '@repo/mdx'
import type { MDXComponents } from 'mdx/types'

import { cn } from 'cn'
import { lazy, Suspense } from 'react'

import { m } from '@/paraglide/messages'

import { CodeBlock } from './code-block'
import { Heading } from './heading'
import { ItemGrid } from './item-grid'
import { LinkCard } from './link-card'
import { LogoShowcase } from './logo-showcase'
import { MdxImage } from './mdx-image'
import { MdxLink } from './mdx-link'
import { MdxStyle } from './mdx-style'
import { SocialLinks } from './social-links'
import { Table } from './table'
import { TreeView } from './tree-view'
import { Video } from './video'

type MdxProps = {
  path: string
  className?: string
  components?: MDXComponents
  unstyled?: boolean
}

type MdxHeadingProps = Omit<React.ComponentProps<typeof Heading>, 'as'>

const MDX_COMPONENTS = {
  h2: (props: MdxHeadingProps) => <Heading as='h2' {...props} />,
  h3: (props: MdxHeadingProps) => <Heading as='h3' {...props} />,
  h4: (props: MdxHeadingProps) => <Heading as='h4' {...props} />,
  h5: (props: MdxHeadingProps) => <Heading as='h5' {...props} />,
  h6: (props: MdxHeadingProps) => <Heading as='h6' {...props} />,
  a: MdxLink,
  style: MdxStyle,
  pre: CodeBlock,
  Image: MdxImage,
  ItemGrid,
  LogoShowcase,
  SocialLinks,
  Table,
  TreeView,
  Video,
  LinkCard,
}

// Render complete HTML during SSR; the browser keeps documents in separate chunks.
const documents: Record<string, MdxModule | (() => Promise<MdxModule>)> = import.meta.env.SSR
  ? import.meta.glob<MdxModule>('/content/**/*.mdx', { eager: true })
  : import.meta.glob<MdxModule>('/content/**/*.mdx')
const contentComponents = Object.fromEntries(
  Object.entries(documents).map(([path, document]) => [
    path,
    typeof document === 'function' ? lazy(document) : document.default,
  ]),
)

/** Load the same compiled module used by the renderer, including its TOC. */
export async function loadMdx(path: string): Promise<MdxModule> {
  const document = documents[path]

  if (!document) throw new Error(`Unknown MDX module: ${path}`)

  return typeof document === 'function' ? document() : document
}

export function Mdx(props: MdxProps) {
  const { path, className, components, unstyled = false } = props
  const Body = contentComponents[path]

  if (!Body) throw new Error(`Unknown MDX module: ${path}`)

  return (
    <div className={cn(!unstyled && 'prose w-full', className)}>
      <Suspense fallback={<output aria-busy='true'>{m.common_loading()}</output>}>
        <Body components={{ ...MDX_COMPONENTS, ...components }} />
      </Suspense>
    </div>
  )
}
