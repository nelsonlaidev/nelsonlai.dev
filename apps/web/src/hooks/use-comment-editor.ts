import { useCallback, useRef } from 'react'

type UseCommentEditorOptions = {
  initialValue?: string
  onModEnter?: () => void
  onEscape?: () => void
}

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

export const useCommentEditor = (options: UseCommentEditorOptions) => {
  const { onModEnter, onEscape, initialValue } = options
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleEmptyListItem = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>, currentLine: string) => {
    if (!textareaRef.current) return

    const { selectionStart, value } = textareaRef.current

    const patterns = [/^\s*[-*+]\s\[\s\]\s$/, /^\s*[-*+]\s\[x\]\s$/i, /^\d+\.\s$/, /^\s*[-*+]\s$/]

    if (patterns.some((pattern) => pattern.test(currentLine))) {
      event.preventDefault()
      const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1
      const lineEnd = selectionStart

      setRangeText(textareaRef.current, '', lineStart, lineEnd, 'start')
      return true
    }

    return false
  }, [])

  const handleShortcut = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.metaKey || event.ctrlKey) {
      switch (event.key.toLowerCase()) {
        case 'b': {
          event.preventDefault()
          decorateText('bold')
          break
        }
        case 'i': {
          event.preventDefault()
          decorateText('italic')
          break
        }
        case 's': {
          event.preventDefault()
          decorateText('strikethrough')
          break
        }
        default: {
          break
        }
      }
    }
  }, [])

  const handleTab = (event: React.KeyboardEvent<HTMLTextAreaElement>, target: HTMLTextAreaElement) => {
    const { selectionStart, selectionEnd } = target

    if (event.key === 'Tab') {
      event.preventDefault()
      const tabSpace = '  '

      setRangeText(target, tabSpace, selectionStart, selectionEnd, 'end')
      target.setSelectionRange(selectionStart + tabSpace.length, selectionStart + tabSpace.length)
    }
  }

  const handleEscape = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onEscape?.()

        return true
      }

      return false
    },
    [onEscape]
  )

  const handleModEnter = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        onModEnter?.()

        return true
      }

      return false
    },
    [onModEnter]
  )

  const handleListContinuation = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>, target: HTMLTextAreaElement) => {
      const { selectionStart, selectionEnd, value } = target

      if (event.key === 'Enter' && !event.shiftKey && !event.metaKey && !event.ctrlKey) {
        const currentLine = value.slice(0, Math.max(0, selectionStart)).split('\n').pop()

        if (!currentLine) return

        if (handleEmptyListItem(event, currentLine)) return

        const taskList = /^(\s*)([-*+])\s\[\s\]\s/.exec(currentLine)

        if (taskList) {
          event.preventDefault()
          const insertText = `\n${taskList[1]}${taskList[2]} [ ] `

          setRangeText(target, insertText, selectionStart, selectionEnd, 'end')
          return
        }

        const taskListChecked = /^(\s*)([-*+])\s\[x\]\s/i.exec(currentLine)

        if (taskListChecked) {
          event.preventDefault()
          const insertText = `\n${taskListChecked[1]}${taskListChecked[2]} [x] `

          setRangeText(target, insertText, selectionStart, selectionEnd, 'end')
          return
        }

        const orderedList = /^(\d+)\.\s/.exec(currentLine)

        if (orderedList?.[1]) {
          event.preventDefault()
          const number = Number.parseInt(orderedList[1], 10) + 1
          const insertText = `\n${number}. `

          setRangeText(target, insertText, selectionStart, selectionEnd, 'end')
          return
        }

        const unorderedList = /^(\s*)([-*+])\s/.exec(currentLine)

        if (unorderedList) {
          event.preventDefault()
          const insertText = `\n${unorderedList[1]}${unorderedList[2]} `

          setRangeText(target, insertText, selectionStart, selectionEnd, 'end')
        }
      }
    },
    [handleEmptyListItem]
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!textareaRef.current) return

      handleShortcut(event)
      handleTab(event, textareaRef.current)

      if (handleEscape(event)) return
      if (handleModEnter(event)) return

      handleListContinuation(event, textareaRef.current)
    },
    [handleShortcut, handleEscape, handleModEnter, handleListContinuation]
  )

  const decorateText = (type: 'bold' | 'italic' | 'strikethrough') => {
    const textarea = textareaRef.current
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

  return {
    textareaRef,
    handleKeyDown,
    initialValue,
    decorateText
  }
}
