import { useTranslations } from '@repo/i18n/client'
import { Button } from '@repo/ui/components/button'
import { Textarea } from '@repo/ui/components/textarea'
import { cn } from '@repo/utils'
import { BoldIcon, ItalicIcon, StrikethroughIcon } from 'lucide-react'

import { useCommentEditor } from '@/hooks/use-comment-editor'

type CommentEditorProps = {
  initialValue?: string
  onModEnter?: () => void
  onEscape?: () => void
} & React.ComponentProps<typeof Textarea>

const CommentEditor = (props: CommentEditorProps) => {
  const { onModEnter, onEscape, initialValue, ...rest } = props
  const t = useTranslations()
  const { textareaRef, handleKeyDown, decorateText } = useCommentEditor({
    onModEnter,
    onEscape,
    initialValue
  })

  return (
    <div
      className={cn(
        'rounded-md border border-input bg-transparent pb-1 font-mono transition-[color,box-shadow] dark:bg-input/30',
        'focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50'
      )}
    >
      <Textarea
        rows={1}
        onKeyDown={handleKeyDown}
        ref={textareaRef}
        defaultValue={initialValue}
        className='min-h-10 resize-none border-none bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent'
        autoComplete='off'
        autoCorrect='off'
        autoCapitalize='off'
        spellCheck='false'
        data-testid='comment-editor-textarea'
        {...rest}
      />
      <div className='flex flex-row items-center gap-0.5 px-1.5'>
        <Button
          aria-label={t('blog.comments.toggle-bold')}
          variant='ghost'
          size='icon'
          className='size-7'
          onClick={() => {
            decorateText('bold')
          }}
        >
          <BoldIcon />
        </Button>
        <Button
          aria-label={t('blog.comments.toggle-strikethrough')}
          variant='ghost'
          size='icon'
          className='size-7'
          onClick={() => {
            decorateText('strikethrough')
          }}
        >
          <StrikethroughIcon />
        </Button>
        <Button
          aria-label={t('blog.comments.toggle-italic')}
          variant='ghost'
          size='icon'
          className='size-7'
          onClick={() => {
            decorateText('italic')
          }}
        >
          <ItalicIcon />
        </Button>
      </div>
    </div>
  )
}

export default CommentEditor
