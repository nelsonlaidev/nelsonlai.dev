import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from '@repo/ui/components/input-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs'
import { BoldIcon, ItalicIcon, StrikethroughIcon } from 'lucide-react'
import { useId } from 'react'

import { useCommentEditor } from '@/hooks/use-comment-editor'
import { m } from '@/paraglide/messages'

import { CommentMarkdown } from './comment-markdown'

type CommentEditorProps = Pick<
  React.ComponentProps<'textarea'>,
  'id' | 'name' | 'onBlur' | 'aria-invalid' | 'aria-describedby'
> & {
  value: string
  onChange: (value: string) => void
  onSubmit: React.KeyboardEventHandler<HTMLTextAreaElement>
  onCancel?: () => void
  disabled: boolean
  isReply?: boolean
  tabsValue?: string
  onTabsValueChange?: (value: string) => void
}

export function CommentEditor(props: CommentEditorProps) {
  const {
    id: inputId,
    name,
    onBlur,
    'aria-invalid': ariaInvalid,
    'aria-describedby': ariaDescribedBy,
    value,
    onChange,
    onSubmit,
    onCancel,
    disabled,
    isReply = false,
    tabsValue,
    onTabsValueChange,
  } = props
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
      <TabsList aria-label={isReply ? m.blog_comments_reply_to_comment() : m.blog_comments_placeholder()}>
        <TabsTrigger value='write'>{m.blog_comments_write()}</TabsTrigger>
        <TabsTrigger value='preview'>{m.blog_comments_preview()}</TabsTrigger>
      </TabsList>
      <TabsContent value='write'>
        <InputGroup>
          <InputGroupTextarea
            id={inputId ?? id}
            name={name}
            onBlur={onBlur}
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedBy}
            ref={editor.textareaRef}
            rows={1}
            value={value}
            disabled={disabled}
            required
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
            onInput={editor.handleInput}
            onChange={(event) => {
              onChange(event.target.value)
            }}
            onKeyDown={editor.handleKeyDown}
            onCompositionStart={editor.handleCompositionStart}
            onCompositionEnd={editor.handleCompositionEnd}
            className='min-h-28 font-mono'
          />
          <InputGroupAddon align='block-end'>
            <InputGroupButton
              type='button'
              size='icon-xs'
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
              size='icon-xs'
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
              size='icon-xs'
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
      <TabsContent value='preview' className='border border-input bg-input/30 px-2.5'>
        <CommentMarkdown className='min-h-28'>
          {value.trim() ? value : m.blog_comments_nothing_to_preview()}
        </CommentMarkdown>
        <div className='h-9.5' />
      </TabsContent>
    </Tabs>
  )
}
