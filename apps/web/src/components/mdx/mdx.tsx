import { MDXContent } from '@content-collections/mdx/react'

import { Heading } from './heading'
import { ItemGrid } from './item-grid'
import { LogoShowcase } from './logo-showcase'
import { MdxImage } from './mdx-image'
import { MdxLink } from './mdx-link'
import { SocialLinks } from './social-links'

type MdxProps = {
  code: string
}

type MdxHeadingProps = Omit<React.ComponentProps<typeof Heading>, 'as'>

const components = {
  h2: (props: MdxHeadingProps) => <Heading as='h2' {...props} />,
  h3: (props: MdxHeadingProps) => <Heading as='h3' {...props} />,
  h4: (props: MdxHeadingProps) => <Heading as='h4' {...props} />,
  h5: (props: MdxHeadingProps) => <Heading as='h5' {...props} />,
  h6: (props: MdxHeadingProps) => <Heading as='h6' {...props} />,
  a: MdxLink,
  Image: MdxImage,
  ItemGrid,
  LogoShowcase,
  SocialLinks,
}

export function Mdx(props: MdxProps) {
  const { code } = props

  return (
    <div className='prose w-full'>
      <MDXContent code={code} components={components} />
    </div>
  )
}
