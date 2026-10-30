import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from '@repo/ui/components/input-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs'
import { BoldIcon, ItalicIcon, StrikethroughIcon } from 'lucide-react'
import { useId } from 'react'

import { Markdown } from '@/components/mdx/markdown'
import { useCommentEditor } from '@/hooks/use-comment-editor'
import { m } from '@/paraglide/messages'

type CommentEditorProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onCancel?: () => void
  disabled: boolean
  isReply?: boolean
  tabsValue?: string
  onTabsValueChange?: (value: string) => void
}

export function CommentEditor(props: CommentEditorProps) {
  const { value, onChange, onSubmit, onCancel, disabled, isReply = false, tabsValue, onTabsValueChange } = props
  const id = useId()
  const editor = useCommentEditor({ onModEnter: onSubmit, onEscape: onCancel })

  return (
    <Tabs
      value={tabsValue}
      defaultValue='write'
      onValueChange={(next) => {
        if (typeof next === 'string') onTabsValueChange?.(next)
      }}
    >
      <TabsList
        aria-label={isReply ? m.blog_comments_reply_to_comment() : m.blog_comments_placeholder()}
        className='bg-[#031e2950]'
      >
        <TabsTrigger value='write'>{m.blog_comments_write()}</TabsTrigger>
        <TabsTrigger value='preview'>{m.blog_comments_preview()}</TabsTrigger>
      </TabsList>
      <TabsContent value='write'>
        <InputGroup className='min-h-11 bg-transparent'>
          <InputGroupTextarea
            id={id}
            ref={editor.textareaRef}
            rows={1}
            value={value}
            disabled={disabled}
            maxLength={10_000}
            aria-label={isReply ? m.blog_comments_reply_to_comment() : m.blog_comments_placeholder()}
            placeholder={isReply ? m.blog_comments_reply_to_comment() : m.blog_comments_placeholder()}
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            spellCheck={false}
            // Reply editors open after an explicit user action.
            // oxlint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={isReply}
            onInput={(event) => {
              editor.handleInput(event)
              onChange(event.currentTarget.value)
            }}
            onChange={(event) => {
              onChange(event.target.value)
            }}
            onKeyDown={editor.handleKeyDown}
            onCompositionStart={editor.handleCompositionStart}
            onCompositionEnd={editor.handleCompositionEnd}
            className='min-h-27.5 resize-none font-sans text-lg/normal text-[#e0ece5] md:text-lg/[calc(1.25/0.875)]'
          />
          <InputGroupAddon align='block-end'>
            <InputGroupButton
              type='button'
              disabled={disabled}
              aria-label={m.blog_comments_toggle_bold()}
              onClick={() => {
                editor.decorateText('bold')
              }}
            >
              <BoldIcon aria-hidden='true' />
            </InputGroupButton>
            <InputGroupButton
              type='button'
              disabled={disabled}
              aria-label={m.blog_comments_toggle_italic()}
              onClick={() => {
                editor.decorateText('italic')
              }}
            >
              <ItalicIcon aria-hidden='true' />
            </InputGroupButton>
            <InputGroupButton
              type='button'
              disabled={disabled}
              aria-label={m.blog_comments_toggle_strikethrough()}
              onClick={() => {
                editor.decorateText('strikethrough')
              }}
            >
              <StrikethroughIcon aria-hidden='true' />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </TabsContent>
      <TabsContent value='preview' className='rounded-md border border-input px-2.5 dark:bg-input/30'>
        <Markdown>{value.trim() ? value : m.blog_comments_nothing_to_preview()}</Markdown>
      </TabsContent>
    </Tabs>
  )
}
