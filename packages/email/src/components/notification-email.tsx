import { Body, Button, Container, Head, Heading, Html, Img, Link, Preview, Section, Text } from 'react-email'

import { Footer } from './footer'
import { GeistFont } from './geist-font'
import { Logo } from './logo'

export const linkStyle = {
  color: '#075d5a',
  textDecoration: 'underline',
}

type NotificationEmailProps = {
  siteUrl: string
  preview: string
  heading: string
  postTitle: string
  postUrl: string
  actor: string
  date: string
  message: string
  children?: React.ReactNode
  actionLabel: string
  actionUrl: string
  footer?: React.ReactNode
}

export function NotificationEmail(props: NotificationEmailProps) {
  const {
    siteUrl,
    preview,
    heading,
    postTitle,
    postUrl,
    actor,
    date,
    message,
    children,
    actionLabel,
    actionUrl,
    footer,
  } = props

  return (
    <Html lang='en'>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='color-scheme' content='light' />
        <meta name='supported-color-schemes' content='light' />
        <GeistFont siteUrl={siteUrl} />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={{ margin: 0, backgroundColor: '#ffffff', fontFamily: 'Geist, Arial, sans-serif' }}>
        <Section style={{ padding: '48px 20px', tableLayout: 'fixed' }}>
          <Container
            width={600}
            style={{
              width: '100%',
              maxWidth: 600,
              tableLayout: 'fixed',
              overflowWrap: 'anywhere',
              wordBreak: 'break-word',
            }}
          >
            <Section style={{ paddingBottom: 44 }}>
              <Logo siteUrl={siteUrl} />
            </Section>
            <Section style={{ backgroundColor: '#123d41', borderRadius: 6 }}>
              <Img
                src={new URL('/images/email/waterline.jpg', siteUrl).href}
                width='600'
                height='200'
                alt=''
                style={{ display: 'block', width: '100%', height: 'auto', minHeight: 3, borderRadius: 6 }}
              />
            </Section>
            <Section style={{ paddingTop: 40, tableLayout: 'fixed' }}>
              <Heading
                as='h1'
                style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.7px', lineHeight: '34px', margin: 0 }}
              >
                {heading}
              </Heading>
              <Text style={{ fontSize: 16, lineHeight: '24px', margin: '10px 0 32px', color: '#455f58' }}>
                On{' '}
                <Link href={postUrl} style={linkStyle}>
                  {postTitle}
                </Link>
              </Text>
              <Section style={{ padding: '20px', tableLayout: 'fixed', backgroundColor: '#eaf4ee', borderRadius: 6 }}>
                <Text style={{ fontSize: 16, fontWeight: 600, lineHeight: '22px', margin: 0 }}>{actor}</Text>
                <Text style={{ fontSize: 13, lineHeight: '20px', color: '#40574c', margin: 0 }}>{date}</Text>
                <Text style={{ fontSize: 16, lineHeight: '25px', whiteSpace: 'pre-wrap', margin: '16px 0 0' }}>
                  {message}
                </Text>
              </Section>
              {children}
              <Section style={{ paddingTop: 32 }}>
                <Button
                  href={actionUrl}
                  style={{
                    backgroundColor: '#075d5a',
                    color: '#ffffff',
                    fontSize: 15,
                    fontWeight: 600,
                    lineHeight: '20px',
                    padding: '12px 20px',
                    borderRadius: 6,
                  }}
                >
                  {actionLabel}
                </Button>
              </Section>
              <Footer>{footer}</Footer>
            </Section>
          </Container>
        </Section>
      </Body>
    </Html>
  )
}
