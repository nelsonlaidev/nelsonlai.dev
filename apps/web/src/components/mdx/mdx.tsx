import { MDXContent } from '@content-collections/mdx/react'
import { cn } from 'cn'

import { CodeBlock } from './code-block'
import { Heading } from './heading'
import { ItemGrid } from './item-grid'
import { LinkCard } from './link-card'
import { LogoShowcase } from './logo-showcase'
import { MdxImage } from './mdx-image'
import { MdxLink } from './mdx-link'
import { SocialLinks } from './social-links'
import { Table } from './table'
import { TreeView } from './tree-view'
import { Video } from './video'

type MdxProps = {
  code: string
  className?: string
}

type MdxHeadingProps = Omit<React.ComponentProps<typeof Heading>, 'as'>

const MDX_COMPONENTS = {
  h2: (props: MdxHeadingProps) => <Heading as='h2' {...props} />,
  h3: (props: MdxHeadingProps) => <Heading as='h3' {...props} />,
  h4: (props: MdxHeadingProps) => <Heading as='h4' {...props} />,
  h5: (props: MdxHeadingProps) => <Heading as='h5' {...props} />,
  h6: (props: MdxHeadingProps) => <Heading as='h6' {...props} />,
  a: MdxLink,
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

export function Mdx(props: MdxProps) {
  const { code, className } = props

  return (
    <div className={cn('prose w-full', className)}>
      <MDXContent code={code} components={MDX_COMPONENTS} />
    </div>
  )
}
