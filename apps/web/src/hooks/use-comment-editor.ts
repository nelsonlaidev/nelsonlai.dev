import { useCallback, useEffect, useRef } from 'react'

type UseCommentEditorOptions = {
  onModEnter?: () => void
  onEscape?: () => void
}

type SetRangeTextOptions = {
  start?: number
  end?: number
  selectionMode?: SelectionMode
}

type Snapshot = {
  value: string
  selectionStart: number
  selectionEnd: number
}

const MAX_UNDO_STACK_SIZE = 100

const setRangeText = (ta: HTMLTextAreaElement, replacement: string, options: SetRangeTextOptions = {}) => {
  const { start = ta.selectionStart, end = ta.selectionEnd, selectionMode = 'preserve' } = options

  ta.setRangeText(replacement, start, end, selectionMode)
  // Trigger input event to update the value
  ta.dispatchEvent(new InputEvent('input', { bubbles: true }))
}

export const useCommentEditor = (options: UseCommentEditorOptions = {}) => {
  const { onModEnter, onEscape } = options
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const undoStack = useRef<Snapshot[]>([])
  const redoStack = useRef<Snapshot[]>([])
  const isComposing = useRef(false)
  const isApplyingHistory = useRef(false)

  const createSnapshot = (ta: HTMLTextAreaElement): Snapshot => ({
    value: ta.value,
    selectionStart: ta.selectionStart,
    selectionEnd: ta.selectionEnd
  })

  const snapshotsEqual = (a?: Snapshot, b?: Snapshot) =>
    !!a && !!b && a.value === b.value && a.selectionStart === b.selectionStart && a.selectionEnd === b.selectionEnd

  const pushUndo = useCallback((snap: Snapshot) => {
    const stack = undoStack.current
    const last = stack.at(-1)
    if (!snapshotsEqual(last, snap)) {
      stack.push(snap)
      if (stack.length > MAX_UNDO_STACK_SIZE) stack.shift()
    }
  }, [])

  const clearRedo = () => {
    redoStack.current = []
  }

  const applySnapshot = (ta: HTMLTextAreaElement, snap: Snapshot) => {
    isApplyingHistory.current = true
    setRangeText(ta, snap.value, { start: 0, end: ta.value.length })
    ta.setSelectionRange(snap.selectionStart, snap.selectionEnd)
    ta.dispatchEvent(new InputEvent('input', { bubbles: true }))
    isApplyingHistory.current = false
    ta.focus()
  }

  const undo = useCallback(() => {
    const ta = textareaRef.current
    if (!ta) return
    const stack = undoStack.current
    if (stack.length <= 1) return
    const current = stack.pop()!
    redoStack.current.push(current)
    const target = stack.at(-1)!
    applySnapshot(ta, target)
  }, [])

  const redo = useCallback(() => {
    const ta = textareaRef.current
    if (!ta) return
    if (redoStack.current.length === 0) return
    const next = redoStack.current.pop()!
    pushUndo(next)
    applySnapshot(ta, next)
  }, [pushUndo])

  const decorateText = useCallback((type: 'bold' | 'italic' | 'strikethrough') => {
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
  }, [])

  const handleInput = useCallback(
    (event: React.FormEvent<HTMLTextAreaElement>) => {
      const ta = event.currentTarget
      if (isApplyingHistory.current) return
      if (isComposing.current) return
      pushUndo(createSnapshot(ta))
      clearRedo()
    },
    [pushUndo]
  )

  const handleCompositionStart = useCallback(
    (event: React.CompositionEvent<HTMLTextAreaElement>) => {
      isComposing.current = true
      pushUndo(createSnapshot(event.currentTarget))
    },
    [pushUndo]
  )

  const handleCompositionEnd = useCallback(
    (event: React.CompositionEvent<HTMLTextAreaElement>) => {
      isComposing.current = false
      pushUndo(createSnapshot(event.currentTarget))
      clearRedo()
    },
    [pushUndo]
  )

  const handleEmptyListItem = (event: React.KeyboardEvent<HTMLTextAreaElement>, currentLine: string) => {
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
  }

  const handleShortcut = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.metaKey || event.ctrlKey) {
        switch (event.key.toLowerCase()) {
          case 'z': {
            event.preventDefault()
            if (event.shiftKey) {
              redo()
            } else {
              undo()
            }
            break
          }
          case 'y': {
            event.preventDefault()
            redo()
            break
          }
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
    },
    [decorateText, redo, undo]
  )

  const handleTab = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>, target: HTMLTextAreaElement) => {
      if (event.key !== 'Tab') return

      event.preventDefault()
      const tabSpace = '  '
      const { selectionStart, selectionEnd, value } = target

      pushUndo(createSnapshot(target))

      if (!value) {
        setRangeText(target, tabSpace, { selectionMode: 'end' })
        clearRedo()
        return
      }

      const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1
      const endWithinIndex = Math.max(selectionStart, selectionEnd - 1)
      const lastLineStart = value.lastIndexOf('\n', Math.max(0, endWithinIndex - 1)) + 1
      const nextNewline = value.indexOf('\n', endWithinIndex)
      const lineBlockEnd = nextNewline === -1 ? value.length : nextNewline

      const isMultiLineSelection = lastLineStart !== lineStart

      if (isMultiLineSelection) {
        const block = value.slice(lineStart, lineBlockEnd)
        const lines = block.split('\n')

        if (event.shiftKey) {
          const transformed = lines
            .map((line) => {
              if (line.startsWith(tabSpace)) return line.slice(tabSpace.length)
              if (line.startsWith('\t')) return line.slice(1)
              return line
            })
            .join('\n')
          setRangeText(target, transformed, { start: lineStart, end: lineBlockEnd, selectionMode: 'preserve' })
        } else {
          const transformed = lines.map((line) => tabSpace + line).join('\n')
          setRangeText(target, transformed, { start: lineStart, end: lineBlockEnd, selectionMode: 'preserve' })
        }
        clearRedo()
        return
      }

      if (event.shiftKey) {
        if (value.startsWith(tabSpace, lineStart) || value[lineStart] === '\t') {
          const removeLen = value.startsWith(tabSpace, lineStart) ? tabSpace.length : 1
          setRangeText(target, '', { start: lineStart, end: lineStart + removeLen, selectionMode: 'preserve' })
          clearRedo()
        }
        return
      }

      setRangeText(target, tabSpace, { selectionMode: 'end' })
      clearRedo()
    },
    [pushUndo]
  )

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
    []
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
    [handleEscape, handleListContinuation, handleModEnter, handleShortcut]
  )

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return

    pushUndo(createSnapshot(ta))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- We only want to run this once on mount
  }, [])

  return {
    textareaRef,
    decorateText,
    undo,
    redo,
    handleKeyDown,
    handleInput,
    handleCompositionStart,
    handleCompositionEnd
  }
}
