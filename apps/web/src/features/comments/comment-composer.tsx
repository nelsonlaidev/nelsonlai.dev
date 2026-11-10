import { CreateCommentInputSchema } from '@repo/api/schema/comments'
import { Button } from '@repo/ui/components/button'
import { DialogTrigger } from '@repo/ui/components/dialog'
import { toast } from '@repo/ui/components/toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SendIcon } from 'lucide-react'
import { useState } from 'react'
import { Skeleton } from 'skullet/react'

import { signInDialogHandle } from '@/features/auth/sign-in-dialog'
import { authClient } from '@/lib/auth-client'
import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'

import { CommentEditor } from './comment-editor'

type CommentComposerProps = {
  slug: string
  parentId?: string
  onCancel?: () => void
}

export function CommentComposer(props: CommentComposerProps) {
  const { slug, parentId, onCancel } = props
  const [body, setBody] = useState('')
  const [error, setError] = useState<string>()
  const [tabsValue, setTabsValue] = useState('write')
  const session = authClient.useSession()
  const queryClient = useQueryClient()
  const creation = useMutation(
    orpc.comments.create.mutationOptions({
      onSuccess: () => {
        setBody('')
        setError(undefined)
        setTabsValue('write')
        void queryClient.invalidateQueries({ queryKey: orpc.comments.key() })
        toast.add({
          type: 'success',
          title: parentId ? m.success_reply_posted() : m.success_comment_posted(),
        })
        onCancel?.()
      },
      onError: () => {
        setError(m.error_something_went_wrong())
      },
    }),
  )

  function submit() {
    if (!session.data || creation.isPending) return
    const parsed = CreateCommentInputSchema.safeParse({ slug, parentId, body, locale: getLocale() })
    if (!parsed.success) {
      setError(parentId ? m.error_reply_cannot_be_empty() : m.error_comment_cannot_be_empty())
      return
    }
    creation.mutate(parsed.data)
  }

  return (
    <Skeleton loading={session.isPending} label={m.common_aria_labels_loading()}>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
        className='space-y-3 rounded-xl border border-input bg-linear-135 from-card/90 to-surface/95 p-4 shadow-xl shadow-backdrop/15 sm:p-6'
        aria-busy={creation.isPending}
      >
        <div className='relative'>
          <CommentEditor
            value={body}
            onChange={setBody}
            onSubmit={submit}
            onCancel={onCancel}
            disabled={!session.data || creation.isPending}
            isReply={Boolean(parentId)}
            tabsValue={tabsValue}
            onTabsValueChange={setTabsValue}
          />
          {!parentId && (
            <Button
              type='submit'
              variant='ghost'
              size='icon-xs'
              className='absolute right-3 bottom-3'
              disabled={!session.data || creation.isPending || !body.trim()}
              aria-label={m.blog_comments_send_comment()}
            >
              <SendIcon className='size-4' aria-hidden='true' />
            </Button>
          )}
          {!session.data && (
            <div className='absolute inset-0 flex items-center justify-center rounded-md bg-black/5 backdrop-blur-[0.8px]'>
              <DialogTrigger
                handle={signInDialogHandle}
                render={<Button type='button' size='sm' disabled={session.isPending} />}
              >
                {m.common_sign_in()}
              </DialogTrigger>
            </div>
          )}
        </div>
        {error && (
          <p role='alert' className='text-sm text-destructive'>
            {error}
          </p>
        )}
        {parentId && (
          <div className='mt-2 flex items-center gap-1'>
            <Button
              type='submit'
              variant='secondary'
              size='sm'
              disabled={!session.data || creation.isPending || !body.trim()}
            >
              {m.blog_comments_reply()}
            </Button>
            {onCancel && (
              <Button type='button' variant='secondary' size='sm' onClick={onCancel} disabled={creation.isPending}>
                {m.common_cancel()}
              </Button>
            )}
          </div>
        )}
      </form>
    </Skeleton>
  )
}
