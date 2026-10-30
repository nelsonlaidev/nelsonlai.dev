import { Img, Section } from 'react-email'

type LogoProps = {
  siteUrl: string
}

function Logo(props: LogoProps) {
  const { siteUrl } = props

  return (
    <Section className='mb-6'>
      <Img
        src={new URL('/images/avatar.png', siteUrl).href}
        alt="Nelson Lai's logo"
        width='48'
        height='48'
        className='rounded-full'
      />
    </Section>
  )
}

export default Logo
