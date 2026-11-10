import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from 'react-email'

import Footer from '../components/footer'
import GeistFont from '../components/geist-font'
import Logo from '../components/logo'

type CommentEmailTemplateProps = {
  comment: string
  commenterName: string
  commenterImage: string
  date: string
  commentUrl: string
  postTitle: string
  postUrl: string
  siteUrl: string
}

function CommentEmailTemplate(props: CommentEmailTemplateProps) {
  const { comment, commenterName, commenterImage, date, commentUrl, postTitle, postUrl, siteUrl } = {
    ...CommentEmailTemplate.PreviewProps,
    ...props,
  }

  return (
    <Html>
      <Head>
        <GeistFont siteUrl={siteUrl} />
      </Head>
      <Preview>New comment on the post "{postTitle}" on nelsonlai.dev</Preview>
      <Tailwind>
        <Body className='m-auto bg-white p-1'>
          <Container className='mx-auto w-full max-w-165 rounded-2xl border border-solid border-neutral-200 bg-white p-8'>
            <Logo siteUrl={siteUrl} />
            <Section>
              <Text className='m-0 p-0 text-xl font-semibold text-gray-900'>New Comment on Your Blog Post</Text>
              <Text className='mx-0 mt-2 mb-0 p-0 text-base text-gray-500'>
                Someone has commented on{' '}
                <Link href={postUrl} className='font-medium text-gray-900'>
                  {postTitle}
                </Link>
              </Text>
            </Section>
            <Section className='mt-6 rounded-xl border border-solid border-neutral-200 bg-gray-50 p-6'>
              <Row>
                <Column className='w-10'>
                  <Img
                    src={commenterImage}
                    width={40}
                    height={40}
                    className='rounded-full'
                    alt={`${commenterName}'s avatar`}
                  />
                </Column>
                <Column>
                  <Text className='m-0 py-0 pr-0 pl-3 text-base font-medium text-gray-900'>{commenterName}</Text>
                  <Text className='m-0 py-0 pr-0 pl-3 text-sm text-gray-500'>{date}</Text>
                </Column>
              </Row>
              <Text className='mx-0 mt-4 mb-0 p-0 text-base text-gray-700'>{comment}</Text>
            </Section>
            <Button
              className='mt-6 rounded-4xl bg-gray-900 px-8 py-2.5 align-middle text-sm font-medium text-white'
              href={commentUrl}
            >
              View Comment
            </Button>
            <Footer siteUrl={siteUrl} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

CommentEmailTemplate.PreviewProps = {
  comment: 'This is exactly what I needed! The explanations are clear and concise. Thanks for sharing! 👏',
  commenterName: 'John Doe',
  commenterImage: 'https://nelsonlai.dev/api/avatar/john-doe.webp',
  date: 'January 1, 2025',
  commentUrl: 'https://nelsonlai.dev/blog/understanding-modern-web-development?comment=1',
  postTitle: 'Understanding Modern Web Development',
  postUrl: 'https://nelsonlai.dev/blog/understanding-modern-web-development',
  siteUrl: 'https://nelsonlai.dev',
} satisfies CommentEmailTemplateProps

export default CommentEmailTemplate
