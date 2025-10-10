import { Button } from '@repo/ui/components/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs'
import { Textarea } from '@repo/ui/components/textarea'
import { cn } from '@repo/ui/utils/cn'
import { BoldIcon, ItalicIcon, StrikethroughIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useCommentEditor } from '@/hooks/use-comment-editor'

import Markdown from '../mdx/markdown'

type CommentEditorProps = {
  tabsValue?: string
  onTabsValueChange?: (value: string) => void
  onModEnter?: () => void
  onEscape?: () => void
} & React.ComponentProps<typeof Textarea>

const CommentEditor = (props: CommentEditorProps) => {
  const { value, tabsValue, onTabsValueChange, onModEnter, onEscape, ...rest } = props
  const t = useTranslations()
  const { textareaRef, handleKeyDown, handleInput, handleCompositionStart, handleCompositionEnd, decorateText } =
    useCommentEditor({
      onModEnter,
      onEscape
    })

  return (
    <Tabs value={tabsValue} onValueChange={onTabsValueChange} defaultValue={tabsValue ?? 'write'}>
      <TabsList>
        <TabsTrigger value='write'>{t('blog.comments.write')}</TabsTrigger>
        <TabsTrigger value='preview'>{t('blog.comments.preview')}</TabsTrigger>
      </TabsList>
      <TabsContent value='write'>
        <div
          className={cn(
            'rounded-md border border-input bg-transparent pb-1 font-mono transition-[color,box-shadow] dark:bg-input/30',
            'focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50'
          )}
        >
          <Textarea
            rows={1}
            value={value}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            ref={textareaRef}
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
      </TabsContent>
      <TabsContent value='preview' className='rounded-md border border-input px-2.5 dark:bg-input/30'>
        <Markdown>{typeof value === 'string' && value.trim() !== '' ? value : 'Nothing to preview'}</Markdown>
      </TabsContent>
    </Tabs>
  )
}

export default CommentEditor
