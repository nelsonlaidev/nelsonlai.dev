import { NotificationEmail } from '../components/notification-email'

type CommentEmailTemplateProps = {
  comment: string
  commenterName: string
  date: string
  commentUrl: string
  postTitle: string
  postUrl: string
  siteUrl: string
}

function CommentEmailTemplate(props: CommentEmailTemplateProps) {
  const { comment, commenterName, date, commentUrl, postTitle, postUrl, siteUrl } = props

  return (
    <NotificationEmail
      siteUrl={siteUrl}
      preview={`New comment on the post "${postTitle}" on Seafold`}
      heading='New comment on your post'
      postTitle={postTitle}
      postUrl={postUrl}
      actor={commenterName}
      date={date}
      message={comment}
      actionLabel='View comment'
      actionUrl={commentUrl}
    />
  )
}

CommentEmailTemplate.PreviewProps = {
  comment: 'How do you choose which details to keep when a layout moves to a smaller screen?',
  commenterName: 'Mira Chen',
  date: 'November 18, 2026',
  commentUrl: 'https://example.invalid/blog/designing-for-small-screens?comment=preview-comment',
  postTitle: 'Designing for small screens',
  postUrl: 'https://example.invalid/blog/designing-for-small-screens',
  siteUrl: 'http://localhost:3000',
} satisfies CommentEmailTemplateProps

export default CommentEmailTemplate
