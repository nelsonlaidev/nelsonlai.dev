import { MDXContent } from '@content-collections/mdx/react'

import { Heading } from './heading'
import { LogoShowcase } from './logo-showcase'
import { MdxLink } from './mdx-link'
import { SocialLinks } from './social-links'

type MdxProps = {
  code: string
}

const components = {
  h2: (props: React.ComponentProps<'h2'>) => <Heading as='h2' {...props} />,
  h3: (props: React.ComponentProps<'h3'>) => <Heading as='h3' {...props} />,
  h4: (props: React.ComponentProps<'h4'>) => <Heading as='h4' {...props} />,
  h5: (props: React.ComponentProps<'h5'>) => <Heading as='h5' {...props} />,
  h6: (props: React.ComponentProps<'h6'>) => <Heading as='h6' {...props} />,
  a: MdxLink,
  LogoShowcase,
  SocialLinks,
}

export function Mdx(props: MdxProps) {
  const { code } = props

  return (
    <div className='prose w-full max-w-none'>
      <MDXContent code={code} components={components} />
    </div>
  )
}
