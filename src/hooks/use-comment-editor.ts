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

const MARKER_MAP = {
  bold: '**',
  italic: '_',
  strikethrough: '~~',
}

function isSpace(char: string) {
  return /\s/.test(char)
}

function getWordBounds(value: string, pos: number) {
  let left = pos
  let right = pos
  while (left > 0 && !isSpace(value[left - 1] ?? ' ')) left -= 1
  while (right < value.length && !isSpace(value[right] ?? ' ')) right += 1
  return { left, right }
}

type DecorationPosition = 'inside' | 'outside' | 'none'

function getDecorationPosition(value: string, start: number, end: number, marker: string): DecorationPosition {
  const selected = value.slice(start, end)
  const inside = selected.length >= 2 * marker.length && selected.startsWith(marker) && selected.endsWith(marker)
  const outside =
    value.slice(start - marker.length, start) === marker && value.slice(end, end + marker.length) === marker
  if (inside) return 'inside'
  if (outside) return 'outside'
  return 'none'
}

function applyPairAtCaret(ta: HTMLTextAreaElement, pos: number, marker: string) {
  const insert = marker + marker
  setRangeText(ta, insert, { start: pos, end: pos, selectionMode: 'end' })
  const caretPos = pos + marker.length
  ta.setSelectionRange(caretPos, caretPos)
  ta.focus()
}

type ToggleAction = 'add' | 'remove'

function getReplacementAndRange(value: string, start: number, end: number, marker: string) {
  const selected = value.slice(start, end)
  const position = getDecorationPosition(value, start, end, marker)

  if (position === 'inside') {
    return {
      rangeStart: start,
      rangeEnd: end,
      replacement: selected.slice(marker.length, selected.length - marker.length),
      action: 'remove' as ToggleAction,
      position: 'inside' as DecorationPosition,
    }
  }

  if (position === 'outside') {
    return {
      rangeStart: start - marker.length,
      rangeEnd: end + marker.length,
      replacement: selected,
      action: 'remove' as ToggleAction,
      position: 'outside' as DecorationPosition,
    }
  }

  return {
    rangeStart: start,
    rangeEnd: end,
    replacement: marker + selected + marker,
    action: 'add' as ToggleAction,
    position: 'none' as DecorationPosition,
  }
}

function computeNewSelection(
  textarea: HTMLTextAreaElement,
  action: ToggleAction,
  markerLength: number,
  position: DecorationPosition,
  keepCaretPos: boolean,
) {
  let { selectionStart, selectionEnd } = textarea

  function shift(delta: number) {
    selectionStart += delta
    selectionEnd += delta
  }

  if (action === 'add' && position === 'none') {
    shift(markerLength)
  }

  if (action === 'remove') {
    if (keepCaretPos || position === 'outside') {
      shift(-markerLength)
    } else if (position === 'inside') {
      selectionEnd -= markerLength * 2
    }
  }

  return { selectionStart, selectionEnd }
}

function setRangeText(ta: HTMLTextAreaElement, replacement: string, options: SetRangeTextOptions = {}) {
  const { start = ta.selectionStart, end = ta.selectionEnd, selectionMode = 'preserve' } = options

  ta.setRangeText(replacement, start, end, selectionMode)
  // Trigger input event to update the value
  ta.dispatchEvent(new InputEvent('input', { bubbles: true }))
}

export function useCommentEditor(options: UseCommentEditorOptions = {}) {
  const { onModEnter, onEscape } = options
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const undoStack = useRef<Snapshot[]>([])
  const redoStack = useRef<Snapshot[]>([])
  const isComposing = useRef(false)
  const isApplyingHistory = useRef(false)

  function createSnapshot(ta: HTMLTextAreaElement): Snapshot {
    return {
      value: ta.value,
      selectionStart: ta.selectionStart,
      selectionEnd: ta.selectionEnd,
    }
  }

  function snapshotsEqual(a?: Snapshot, b?: Snapshot) {
    if (!a || !b) return false

    return a.value === b.value && a.selectionStart === b.selectionStart && a.selectionEnd === b.selectionEnd
  }

  const pushUndo = useCallback((snap: Snapshot) => {
    const stack = undoStack.current
    const last = stack.at(-1)
    if (!snapshotsEqual(last, snap)) {
      stack.push(snap)
      if (stack.length > MAX_UNDO_STACK_SIZE) stack.shift()
    }
  }, [])

  function clearRedo() {
    redoStack.current = []
  }

  function applySnapshot(ta: HTMLTextAreaElement, snap: Snapshot) {
    isApplyingHistory.current = true
    setRangeText(ta, snap.value, { start: 0, end: ta.value.length })
    ta.setSelectionRange(snap.selectionStart, snap.selectionEnd)
    ta.dispatchEvent(new InputEvent('input', { bubbles: true }))
    isApplyingHistory.current = false
    ta.focus()
  }

  const undo = useCallback(() => {
    const ta = textareaRef.current
    const stack = undoStack.current

    if (!ta || stack.length <= 1) return

    const current = stack.pop()
    if (!current) return

    redoStack.current.push(current)

    const target = stack.at(-1)

    if (target) {
      applySnapshot(ta, target)
    }
  }, [])

  const redo = useCallback(() => {
    const ta = textareaRef.current

    const next = redoStack.current.pop()

    if (!ta || !next) return

    pushUndo(next)
    applySnapshot(ta, next)
  }, [pushUndo])

  const decorateText = useCallback((type: keyof typeof MARKER_MAP) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const marker = MARKER_MAP[type]
    const { value } = textarea
    let { selectionStart: start, selectionEnd: end } = textarea
    let keepCaretPos = false

    // If there is no text is selected → handle the word under the caret
    if (start === end) {
      const { left, right } = getWordBounds(value, start)

      const noWordUnderCaret = left === right
      if (noWordUnderCaret) {
        // If no word under caret → insert a pair of markers
        applyPairAtCaret(textarea, start, marker)
        return
      }

      // If there is a word under the caret → select the whole word and keep the caret relative position
      start = left
      end = right
      keepCaretPos = true
    }

    // Calculate replacement text and range
    const { rangeStart, rangeEnd, replacement, action, position } = getReplacementAndRange(value, start, end, marker)

    // Calculate new selection range
    const { selectionStart, selectionEnd } = computeNewSelection(
      textarea,
      action,
      marker.length,
      position,
      keepCaretPos,
    )

    // Apply replacement and update caret
    setRangeText(textarea, replacement, {
      start: rangeStart,
      end: rangeEnd,
      selectionMode: 'preserve',
    })
    textarea.setSelectionRange(selectionStart, selectionEnd)
    textarea.focus()
  }, [])

  const handleInput = useCallback(
    (event: React.InputEvent<HTMLTextAreaElement>) => {
      const ta = event.currentTarget
      if (isApplyingHistory.current) return
      if (isComposing.current) return
      pushUndo(createSnapshot(ta))
      clearRedo()
    },
    [pushUndo],
  )

  const handleCompositionStart = useCallback(
    (event: React.CompositionEvent<HTMLTextAreaElement>) => {
      isComposing.current = true
      pushUndo(createSnapshot(event.currentTarget))
    },
    [pushUndo],
  )

  const handleCompositionEnd = useCallback(
    (event: React.CompositionEvent<HTMLTextAreaElement>) => {
      isComposing.current = false
      pushUndo(createSnapshot(event.currentTarget))
      clearRedo()
    },
    [pushUndo],
  )

  function handleEmptyListItem(event: React.KeyboardEvent<HTMLTextAreaElement>, currentLine: string) {
    if (!textareaRef.current) return

    const patterns = [
      /^\s*[-*+]\s\[[x\s]\]\s$/, // Task list item
      /^\d+\.\s$/, // Ordered list item
      /^\s*[-*+]\s$/, // Unordered list item
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
    [decorateText, redo, undo],
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
    [pushUndo],
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
    [onEscape],
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
    [onModEnter],
  )

  const handleListContinuation = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>, target: HTMLTextAreaElement) => {
      const { selectionStart, value } = target

      if (event.key === 'Enter' && !event.shiftKey && !event.metaKey && !event.ctrlKey) {
        const currentLine = value.slice(0, Math.max(0, selectionStart)).split('\n').pop()

        if (!currentLine) return

        if (handleEmptyListItem(event, currentLine)) return

        const taskList = /^(\s*)([-*+])\s\[[x\s]\]\s/.exec(currentLine)

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
    [],
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
    [handleEscape, handleListContinuation, handleModEnter, handleShortcut, handleTab],
  )

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return

    pushUndo(createSnapshot(ta))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run once
  }, [])

  return {
    textareaRef,
    decorateText,
    undo,
    redo,
    handleKeyDown,
    handleInput,
    handleCompositionStart,
    handleCompositionEnd,
  }
}
