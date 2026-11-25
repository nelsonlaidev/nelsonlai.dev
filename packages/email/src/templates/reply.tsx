import { Link, Section, Text } from 'react-email'

import { linkStyle, NotificationEmail } from '../components/notification-email'

type ReplyEmailTemplateProps = {
  reply: string
  replierName: string
  comment: string
  date: string
  replyUrl: string
  postTitle: string
  postUrl: string
  siteUrl: string
  unsubscribeUrl: string
}

function ReplyEmailTemplate(props: ReplyEmailTemplateProps) {
  const { reply, replierName, comment, date, replyUrl, postTitle, postUrl, siteUrl, unsubscribeUrl } = props

  return (
    <NotificationEmail
      siteUrl={siteUrl}
      preview={`New reply on the post "${postTitle}" on nelsonlai.dev`}
      heading='New reply to your comment'
      postTitle={postTitle}
      postUrl={postUrl}
      actor={replierName}
      date={date}
      message={reply}
      actionLabel='View reply'
      actionUrl={replyUrl}
      footer={
        <Text style={{ color: '#435951', fontSize: 13, lineHeight: '20px', margin: '0 0 12px' }}>
          You received this email because someone replied to your comment.
          <br />
          <Link
            href={new URL('/account/settings', siteUrl).href}
            style={{ ...linkStyle, display: 'inline-block', marginRight: 14, lineHeight: '24px' }}
          >
            Manage all reply notifications
          </Link>{' '}
          <Link href={unsubscribeUrl} style={{ ...linkStyle, display: 'inline-block', lineHeight: '24px' }}>
            Unsubscribe from this thread
          </Link>
        </Text>
      }
    >
      <Section style={{ marginTop: 24, paddingLeft: 14, borderLeft: '2px solid #bccfc5', tableLayout: 'fixed' }}>
        <Text style={{ color: '#475d55', fontSize: 13, fontWeight: 600, lineHeight: '20px', margin: 0 }}>
          Your comment
        </Text>
        <Text style={{ color: '#475d55', fontSize: 15, lineHeight: '23px', whiteSpace: 'pre-wrap', margin: '4px 0 0' }}>
          {comment}
        </Text>
      </Section>
    </NotificationEmail>
  )
}

ReplyEmailTemplate.PreviewProps = {
  reply:
    'I start with what the reader came to do. On a small screen, keeping the next action close to the text makes a real difference.',
  replierName: 'Alex Rivera',
  comment: 'How do you choose which details to keep when a layout moves to a smaller screen?',
  date: 'November 19, 2026',
  replyUrl: 'https://example.invalid/blog/designing-for-small-screens?comment=preview-comment&reply=preview-reply',
  postTitle: 'Designing for small screens',
  postUrl: 'https://example.invalid/blog/designing-for-small-screens',
  siteUrl: 'http://localhost:3000',
  unsubscribeUrl: 'https://example.invalid/unsubscribe?token=preview-only',
} satisfies ReplyEmailTemplateProps

export default ReplyEmailTemplate
