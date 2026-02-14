import UnsubscribeCommentReplyForm from '@/components/unsubscribe-comment-reply-form'
import UnsubscribeError from '@/components/unsubscribe-error'
import { getUnsubData } from '@/lib/unsubscribe'
import { loadUnsubscribeParams } from '@/lib/unsubscribe-params'

async function Page(props: PageProps<'/[locale]/unsubscribe'>) {
  const { searchParams } = props
  const { token } = await loadUnsubscribeParams(searchParams)
  const data = await getUnsubData(token)

  if (!data) {
    return <UnsubscribeError />
  }

  // Allow for future types
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (data.type === 'comment_reply') {
    return <UnsubscribeCommentReplyForm data={data} />
  }

  return <UnsubscribeError />
}

export default Page
