import { useTranslations } from '@repo/i18n/client'
import { Button } from '@repo/ui/components/button'
import { Textarea } from '@repo/ui/components/textarea'
import { cn } from '@repo/utils'
import { BoldIcon, ItalicIcon, StrikethroughIcon } from 'lucide-react'
import { useRef } from 'react'

type Command = {
  onModEnter?: () => void
  onEscape?: () => void
}

type CommentEditorProps = {
  initialValue?: string
} & Command &
  React.ComponentProps<typeof Textarea>

const setRangeText = (
  textarea: HTMLTextAreaElement,
  replacement: string,
  start: number,
  end: number,
  selectionMode?: SelectionMode
) => {
  textarea.setRangeText(replacement, start, end, selectionMode)
  // Trigger input event to update the value
  textarea.dispatchEvent(new Event('input', { bubbles: true }))
}

const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>, command: Command) => {
  const { onModEnter, onEscape } = command
  const textarea = event.target as HTMLTextAreaElement
  const { selectionStart, selectionEnd, value } = textarea

  if (event.key === 'Tab') {
    event.preventDefault()
    const tabSpace = '  '

    setRangeText(textarea, tabSpace, selectionStart, selectionEnd, 'end')
    textarea.setSelectionRange(selectionStart + tabSpace.length, selectionStart + tabSpace.length)
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    onEscape?.()

    return
  }

  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault()
    onModEnter?.()

    return
  }

  if (event.key === 'Enter') {
    const currentLine = value.slice(0, Math.max(0, selectionStart)).split('\n').pop()

    const unorderedListNoContent = currentLine?.match(/^\s*[-*+]\s$/)
    const orderedListNoContent = currentLine?.match(/^\d+\.\s$/)
    const taskListNoContent = currentLine?.match(/^\s*[-*+]\s\[\s\]\s$/)
    const taskListCheckedNoContent = currentLine?.match(/^\s*[-*+]\s\[x\]\s$/i)

    if (!!unorderedListNoContent || !!orderedListNoContent || !!taskListNoContent || !!taskListCheckedNoContent) {
      event.preventDefault()

      const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1
      const lineEnd = selectionStart
      setRangeText(textarea, '', lineStart, lineEnd, 'start')

      return
    }

    const orderedList = currentLine?.match(/^(\d+)\.\s/)

    if (orderedList?.[1]) {
      const number = Number.parseInt(orderedList[1], 10) + 1
      const insertText = `\n${number}. `

      event.preventDefault()
      setRangeText(textarea, insertText, selectionStart, selectionEnd, 'end')
      return
    }

    const taskList = currentLine?.match(/^(\s*)([-*+])\s\[\s\]\s/)
    const taskListChecked = currentLine?.match(/^(\s*)([-*+])\s\[x\]\s/i)

    if (taskList) {
      const insertText = `\n${taskList[1]}${taskList[2]} [ ] `

      event.preventDefault()
      setRangeText(textarea, insertText, selectionStart, selectionEnd, 'end')
      return
    }

    if (taskListChecked) {
      const insertText = `\n${taskListChecked[1]}${taskListChecked[2]} [x] `

      event.preventDefault()
      setRangeText(textarea, insertText, selectionStart, selectionEnd, 'end')
      return
    }

    const unorderedList = currentLine?.match(/^(\s*)([-*+])\s/)

    if (unorderedList) {
      const insertText = `\n${unorderedList[1]}${unorderedList[2]} `

      event.preventDefault()
      setRangeText(textarea, insertText, selectionStart, selectionEnd, 'end')
      return
    }
  }
}

const decorateText = (textarea: HTMLTextAreaElement | null, type: 'bold' | 'italic' | 'strikethrough') => {
  if (!textarea) return

  const { selectionStart, selectionEnd, value } = textarea
  const selectedText = value.slice(selectionStart, selectionEnd)

  const decoration = {
    bold: `**${selectedText}**`,
    strikethrough: `~~${selectedText}~~`,
    italic: `_${selectedText}_`
  }

  const newSelectionStart = {
    bold: selectionStart + 2,
    strikethrough: selectionStart + 2,
    italic: selectionStart + 1
  }

  setRangeText(textarea, decoration[type], selectionStart, selectionEnd, 'end')

  if (!selectedText) {
    textarea.setSelectionRange(newSelectionStart[type], newSelectionStart[type])
  }

  textarea.focus()
}

const CommentEditor = (props: CommentEditorProps) => {
  const { onModEnter, onEscape, initialValue, ...rest } = props
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const t = useTranslations()

  return (
    <div
      className={cn(
        'rounded-md border border-input bg-transparent pb-1 font-mono transition-[color,box-shadow] dark:bg-input/30',
        'focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50'
      )}
    >
      <Textarea
        rows={1}
        onKeyDown={(e) => {
          handleKeyDown(e, { onModEnter, onEscape })
        }}
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
            decorateText(textareaRef.current, 'bold')
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
            decorateText(textareaRef.current, 'strikethrough')
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
            decorateText(textareaRef.current, 'italic')
          }}
        >
          <ItalicIcon />
        </Button>
      </div>
    </div>
  )
}

export default CommentEditor
