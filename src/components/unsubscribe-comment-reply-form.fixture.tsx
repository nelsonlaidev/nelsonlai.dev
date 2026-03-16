'use client'

import { getMaskedEmail } from '@/utils/get-masked-email'

import { Demo, DemoItem } from './ui/demo'
import { UnsubscribeCommentReplyForm } from './unsubscribe-comment-reply-form'

const baseData = {
  type: 'comment_reply' as const,
  comment: 'This is a great post! I really enjoyed reading it and learned a lot from the examples.',
  userEmail: getMaskedEmail('me@nelsonlai.dev'),
  token: 'mock-token',
  userId: 'mock-user-id',
  commentId: 'mock-comment-id',
}

export default function UnsubscribeCommentReplyFormDemo() {
  return (
    <Demo title='Unsubscribe Comment Reply Form'>
      <DemoItem title='Pending' className='justify-center'>
        <UnsubscribeCommentReplyForm data={{ ...baseData, isUnsubscribed: false }} />
      </DemoItem>
      <DemoItem title='Already Unsubscribed' className='justify-center'>
        <UnsubscribeCommentReplyForm data={{ ...baseData, isUnsubscribed: true }} />
      </DemoItem>
    </Demo>
  )
}
