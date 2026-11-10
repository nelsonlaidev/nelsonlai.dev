import { Column, Hr, Img, Link, Row, Section, Text } from 'react-email'

const currentYear = new Date().getFullYear()

type FooterProps = {
  siteUrl: string
}

function Footer(props: FooterProps) {
  const { siteUrl } = props

  return (
    <>
      <Hr className='mt-6 mb-3' />
      <Section>
        <Row className='mt-4' align='left' width='auto'>
          <Column className='pr-6 align-middle'>
            <Link href='https://x.com/nelsonlaidev' className='text-xl text-black'>
              <Img src={new URL('/images/email/x.png', siteUrl).href} alt='X' width={22} height={22} />
            </Link>
          </Column>
          <Column className='align-middle'>
            <Link href='https://github.com/nelsonlaidev/nelsonlai.dev' className='text-xl text-black'>
              <Img src={new URL('/images/email/github.png', siteUrl).href} alt='GitHub' width={22} height={22} />
            </Link>
          </Column>
        </Row>
      </Section>
      <Text className='mx-0 mt-6 mb-0 p-0 text-xs text-gray-500'>© {currentYear} Nelson Lai. All rights reserved.</Text>
    </>
  )
}

export default Footer
