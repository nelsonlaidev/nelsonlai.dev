import { useCallback, useRef } from 'react'

type UseCommentEditorOptions = {
  onModEnter?: () => void
  onEscape?: () => void
}

type SetRangeTextOptions = {
  start?: number
  end?: number
  selectionMode?: SelectionMode
}

const setRangeText = (textarea: HTMLTextAreaElement, replacement: string, options: SetRangeTextOptions = {}) => {
  const { start = textarea.selectionStart, end = textarea.selectionEnd, selectionMode = 'preserve' } = options

  textarea.setRangeText(replacement, start, end, selectionMode)
  // Trigger input event to update the value
  textarea.dispatchEvent(new Event('input', { bubbles: true }))
}

export const useCommentEditor = (options: UseCommentEditorOptions = {}) => {
  const { onModEnter, onEscape } = options
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleEmptyListItem = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>, currentLine: string) => {
    if (!textareaRef.current) return

    const patterns = [
      /^\s*[-*+]\s\[[x\s]\]\s$/i, // Task list item
      /^\d+\.\s$/, // Ordered list item
      /^\s*[-*+]\s$/ // Unordered list item
    ]

    if (patterns.some((pattern) => pattern.test(currentLine))) {
      event.preventDefault()
      const { selectionStart, value } = textareaRef.current

      const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1
      const lineEnd = selectionStart

      setRangeText(textareaRef.current, '', { start: lineStart, end: lineEnd, selectionMode: 'start' })

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
    if (event.key === 'Tab') {
      event.preventDefault()
      const tabSpace = '  '

      setRangeText(target, tabSpace, { selectionMode: 'end' })
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
      const { selectionStart, value } = target

      if (event.key === 'Enter' && !event.shiftKey && !event.metaKey && !event.ctrlKey) {
        const currentLine = value.slice(0, Math.max(0, selectionStart)).split('\n').pop()

        if (!currentLine) return

        if (handleEmptyListItem(event, currentLine)) return

        const taskList = /^(\s*)([-*+])\s\[[x\s]\]\s/i.exec(currentLine)

        if (taskList) {
          event.preventDefault()
          const text = `\n${taskList[1]}${taskList[2]} [ ] `

          setRangeText(target, text, { selectionMode: 'end' })
          return
        }

        const orderedList = /^(\d+)\.\s/.exec(currentLine)

        if (orderedList?.[1]) {
          event.preventDefault()
          const number = Number.parseInt(orderedList[1], 10) + 1
          const text = `\n${number}. `

          setRangeText(target, text, { selectionMode: 'end' })
          return
        }

        const unorderedList = /^(\s*)([-*+])\s/.exec(currentLine)

        if (unorderedList) {
          event.preventDefault()
          const text = `\n${unorderedList[1]}${unorderedList[2]} `

          setRangeText(target, text, { selectionMode: 'end' })
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

    setRangeText(textarea, decoration[type], { selectionMode: 'end' })

    if (!selectedText) {
      textarea.setSelectionRange(newSelectionStart[type], newSelectionStart[type])
    }

    textarea.focus()
  }

  return {
    textareaRef,
    handleKeyDown,
    decorateText
  }
}
