import type { Textarea } from '@/components/ui/textarea'

import { BoldIcon, ItalicIcon, StrikethroughIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCommentEditor } from '@/hooks/use-comment-editor'

import Markdown from '../mdx/markdown'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from '../ui/input-group'

type CommentEditorProps = {
  tabsValue?: string
  onTabsValueChange?: (value: string) => void
  onModEnter?: () => void
  onEscape?: () => void
} & React.ComponentProps<typeof Textarea>

function CommentEditor(props: CommentEditorProps) {
  const { value, tabsValue, onTabsValueChange, onModEnter, onEscape, ...rest } = props
  const t = useTranslations()
  const { textareaRef, handleKeyDown, handleInput, handleCompositionStart, handleCompositionEnd, decorateText } =
    useCommentEditor({
      onModEnter,
      onEscape,
    })

  return (
    <Tabs value={tabsValue} onValueChange={onTabsValueChange} defaultValue={tabsValue ?? 'write'}>
      <TabsList>
        <TabsTrigger value='write'>{t('blog.comments.write')}</TabsTrigger>
        <TabsTrigger value='preview'>{t('blog.comments.preview')}</TabsTrigger>
      </TabsList>
      <TabsContent value='write'>
        <InputGroup>
          <InputGroupTextarea
            rows={1}
            value={value}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            ref={textareaRef}
            className='min-h-10 resize-none font-mono'
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            spellCheck='false'
            data-testid='comment-editor-textarea'
            {...rest}
          />
          <InputGroupAddon align='block-end'>
            <InputGroupButton
              aria-label={t('blog.comments.toggle-bold')}
              variant='ghost'
              size='icon-xs'
              onClick={() => {
                decorateText('bold')
              }}
            >
              <BoldIcon />
            </InputGroupButton>
            <InputGroupButton
              aria-label={t('blog.comments.toggle-strikethrough')}
              variant='ghost'
              size='icon-xs'
              onClick={() => {
                decorateText('strikethrough')
              }}
            >
              <StrikethroughIcon />
            </InputGroupButton>
            <InputGroupButton
              aria-label={t('blog.comments.toggle-italic')}
              variant='ghost'
              size='icon-xs'
              onClick={() => {
                decorateText('italic')
              }}
            >
              <ItalicIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </TabsContent>
      <TabsContent value='preview' className='rounded-md border border-input px-2.5 dark:bg-input/30'>
        <Markdown>{typeof value === 'string' && value.trim() !== '' ? value : 'Nothing to preview'}</Markdown>
      </TabsContent>
    </Tabs>
  )
}

export default CommentEditor
