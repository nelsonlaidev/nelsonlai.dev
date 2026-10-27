import { Img, Section } from 'react-email'

function Logo(props: { siteUrl: string }) {
  return (
    <Section className='mb-6'>
      <Img
        src={new URL('/images/avatar.png', props.siteUrl).href}
        alt="Nelson Lai's logo"
        width='48'
        height='48'
        className='rounded-full'
      />
    </Section>
  )
}

export default Logo
