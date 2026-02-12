import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'

import CommentEditor from '@/components/comment-section/comment-editor'
import { render } from '@/utils/render'

type SimulateIMEInputOptions = {
  textarea: HTMLTextAreaElement
  textValue: string
  intermediateData: string
  composedText: string
  caretPosition: number
}

function simulateIMEInput(options: SimulateIMEInputOptions) {
  const { textarea, textValue, intermediateData, composedText, caretPosition } = options

  fireEvent.compositionStart(textarea, { data: '' })
  fireEvent.change(textarea, { target: { value: textValue } })
  textarea.setSelectionRange(caretPosition, caretPosition)
  fireEvent.compositionUpdate(textarea, { data: intermediateData })
  fireEvent.compositionEnd(textarea, { data: composedText })
}

describe('<CommentEditor />', () => {
  describe('basic behavior', () => {
    test('renders textarea and decoration buttons', () => {
      expect.assertions(4)

      render(<CommentEditor />)

      const textarea = screen.getByTestId('comment-editor-textarea')

      expect(textarea).toBeInTheDocument()

      expect(screen.getByLabelText('Toggle bold')).toBeInTheDocument()
      expect(screen.getByLabelText('Toggle strikethrough')).toBeInTheDocument()
      expect(screen.getByLabelText('Toggle italic')).toBeInTheDocument()
    })

    test('calls onEscape on Escape', () => {
      expect.assertions(1)

      const onEscape = vi.fn<() => void>()

      render(<CommentEditor onEscape={onEscape} />)

      const textarea = screen.getByTestId('comment-editor-textarea')
      textarea.focus()

      fireEvent.keyDown(textarea, { key: 'Escape', code: 'Escape' })

      expect(onEscape).toHaveBeenCalledTimes(1)
    })

    test('calls onModEnter on Cmd/Ctrl + Enter', () => {
      expect.assertions(2)

      const onModEnter = vi.fn<() => void>()

      render(<CommentEditor onModEnter={onModEnter} />)

      const textarea = screen.getByTestId('comment-editor-textarea')
      textarea.focus()

      // Test Ctrl + Enter
      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', ctrlKey: true })

      expect(onModEnter).toHaveBeenCalledTimes(1)

      // Test Cmd + Enter (macOS)
      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', metaKey: true })

      expect(onModEnter).toHaveBeenCalledTimes(2)
    })
  })

  describe('tab key handling', () => {
    test('indents current line on Tab', () => {
      expect.assertions(2)

      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')
      textarea.focus()

      fireEvent.change(textarea, { target: { value: 'test' } })
      textarea.setSelectionRange(0, 0) // Move caret to the start

      fireEvent.keyDown(textarea, { key: 'Tab', code: 'Tab', charCode: 9 })

      expect(textarea).toHaveValue('  test')
      expect(textarea.selectionStart).toBe(2)
    })

    test('indents current line on Tab when textarea is empty', () => {
      expect.assertions(2)

      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')
      textarea.focus()

      fireEvent.keyDown(textarea, { key: 'Tab', code: 'Tab', charCode: 9 })

      expect(textarea).toHaveValue('  ')
      expect(textarea.selectionStart).toBe(2)
    })

    test('unindents current line on Shift+Tab', () => {
      expect.assertions(4)

      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: '  test' } })
      textarea.setSelectionRange(6, 6) // Move caret to the end

      fireEvent.keyDown(textarea, { key: 'Tab', code: 'Tab', shiftKey: true })

      expect(textarea).toHaveValue('test')
      expect(textarea.selectionStart).toBe(4)

      fireEvent.change(textarea, { target: { value: '\ttest' } })
      textarea.setSelectionRange(5, 5) // Move caret to the end

      fireEvent.keyDown(textarea, { key: 'Tab', code: 'Tab', shiftKey: true })

      expect(textarea).toHaveValue('test')
      expect(textarea.selectionStart).toBe(4)
    })

    test('indents selected lines with Tab', () => {
      expect.assertions(1)

      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: 'a\nb\nc' } })
      textarea.setSelectionRange(0, 3) // Select first two lines

      fireEvent.keyDown(textarea, { key: 'Tab', code: 'Tab' })

      expect(textarea).toHaveValue('  a\n  b\nc')
    })

    test('un-indents selected lines with Shift+Tab', () => {
      expect.assertions(2)

      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: '  a\n  b\nc' } })
      textarea.setSelectionRange(0, 7) // Select first two lines

      fireEvent.keyDown(textarea, { key: 'Tab', code: 'Tab', shiftKey: true })

      expect(textarea).toHaveValue('a\nb\nc')

      fireEvent.change(textarea, { target: { value: '\ta\n\tb\nc' } })
      textarea.setSelectionRange(0, 5) // Select first two lines

      fireEvent.keyDown(textarea, { key: 'Tab', code: 'Tab', shiftKey: true })

      expect(textarea).toHaveValue('a\nb\nc')
    })

    test('does nothing when un-indenting non-indented lines', () => {
      expect.assertions(1)

      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: 'a\nb\nc' } })
      textarea.setSelectionRange(0, 3) // Select first two lines

      fireEvent.keyDown(textarea, { key: 'Tab', code: 'Tab', shiftKey: true })

      expect(textarea).toHaveValue('a\nb\nc')
    })
  })

  describe('list operations', () => {
    test('removes empty list item on Enter', () => {
      expect.assertions(5)

      render(<CommentEditor />)
      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      // Unordered list
      fireEvent.change(textarea, { target: { value: '- 123\n- ' } })
      textarea.setSelectionRange(8, 8)
      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })

      expect(textarea).toHaveValue('- 123\n')

      // Ordered list
      fireEvent.change(textarea, { target: { value: '1. 123\n2. ' } })
      textarea.setSelectionRange(10, 10)
      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })

      expect(textarea).toHaveValue('1. 123\n')

      // Task list
      fireEvent.change(textarea, { target: { value: '- [ ]\n- [ ] ' } })
      textarea.setSelectionRange(12, 12)
      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })

      expect(textarea).toHaveValue('- [ ]\n')

      // Checked task list
      fireEvent.change(textarea, { target: { value: '- [x]\n- [x] ' } })
      textarea.setSelectionRange(12, 12)
      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })

      expect(textarea).toHaveValue('- [x]\n')

      // Complex case
      fireEvent.change(textarea, { target: { value: '- 123\n- 123\n- \n\n- 123\n- 123' } })
      textarea.setSelectionRange(14, 14)
      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })

      expect(textarea).toHaveValue('- 123\n- 123\n\n\n- 123\n- 123')
    })

    test.each([
      { type: 'unordered', initial: '* Item 1', expected: '* Item 1\n* ' },
      { type: 'ordered', initial: '1. First item', expected: '1. First item\n2. ' },
      { type: 'task', initial: '- [ ] Task 1', expected: '- [ ] Task 1\n- [ ] ' },
      { type: 'checked task', initial: '- [x] Completed task', expected: '- [x] Completed task\n- [ ] ' },
    ])('creates $type list item on Enter', ({ initial, expected }) => {
      expect.assertions(2)

      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: initial } })
      textarea.setSelectionRange(initial.length, initial.length)

      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })

      expect(textarea).toHaveValue(expected)
      expect(textarea.selectionStart).toBe(expected.length)
    })

    test('splits list item in the middle on Enter', () => {
      expect.assertions(2)

      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: '- 1234' } })
      textarea.setSelectionRange(4, 4) // Caret is at '- 12|34'

      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })

      expect(textarea).toHaveValue('- 12\n- 34')
      expect(textarea.selectionStart).toBe(7) // Caret is at '- 12\n- |34'
    })
  })

  describe('text formatting', () => {
    const SETS = [
      { action: 'bolds', buttonLabel: 'Toggle bold', marker: '**' },
      { action: 'italicizes', buttonLabel: 'Toggle italic', marker: '_' },
      { action: 'strikes through', buttonLabel: 'Toggle strikethrough', marker: '~~' },
    ]

    describe('button actions', () => {
      test.each(SETS)('$action selected text', ({ buttonLabel, marker }) => {
        expect.assertions(3)

        render(<CommentEditor />)

        const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

        fireEvent.change(textarea, { target: { value: 'hello world' } })
        textarea.setSelectionRange(0, 5) // Select 'hello'

        const boldButton = screen.getByLabelText(buttonLabel)
        fireEvent.click(boldButton)

        expect(textarea).toHaveValue(`${marker}hello${marker} world`)
        // Still selecting 'hello'
        expect(textarea.selectionStart).toBe(marker.length)
        expect(textarea.selectionEnd).toBe(5 + marker.length)
      })

      test.each(SETS)('un-$action selected text if already formatted', ({ buttonLabel, marker }) => {
        expect.assertions(3)

        render(<CommentEditor />)

        const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

        fireEvent.change(textarea, { target: { value: `${marker}hello${marker} world` } })
        textarea.setSelectionRange(marker.length, 5 + marker.length) // Select 'hello'

        const boldButton = screen.getByLabelText(buttonLabel)
        fireEvent.click(boldButton)

        expect(textarea).toHaveValue('hello world')
        // Still selecting 'hello'
        expect(textarea.selectionStart).toBe(0)
        expect(textarea.selectionEnd).toBe(5)
      })

      test.each(SETS)('$action current word when no selection', ({ buttonLabel, marker }) => {
        expect.assertions(3)

        render(<CommentEditor />)

        const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

        fireEvent.change(textarea, { target: { value: 'hello world' } })
        textarea.setSelectionRange(3, 3) // Caret is at 'hel|lo world'

        const boldButton = screen.getByLabelText(buttonLabel)
        fireEvent.click(boldButton)

        expect(textarea).toHaveValue(`${marker}hello${marker} world`)
        // Should keep the caret at original position within the word
        expect(textarea.selectionStart).toBe(3 + marker.length)
        expect(textarea.selectionEnd).toBe(3 + marker.length)
      })

      test.each(SETS)('un-$action current word if already formatted when no selection', ({ buttonLabel, marker }) => {
        expect.assertions(3)

        render(<CommentEditor />)

        const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

        fireEvent.change(textarea, { target: { value: `${marker}hello${marker} world` } })
        textarea.setSelectionRange(3 + marker.length, 3 + marker.length) // Caret is at '${marker}hel|lo${marker}'

        const boldButton = screen.getByLabelText(buttonLabel)
        fireEvent.click(boldButton)

        expect(textarea).toHaveValue('hello world')
        // Should keep the caret at original position within the word
        expect(textarea.selectionStart).toBe(3)
        expect(textarea.selectionEnd).toBe(3)
      })
    })

    describe('keyboard shortcuts', () => {
      test.each([
        { action: 'bolds', modifier: 'Ctrl+B', key: 'b', code: 'KeyB', ctrlKey: true, marker: '**' },
        { action: 'bolds', modifier: 'Cmd+B', key: 'b', code: 'KeyB', metaKey: true, marker: '**' },
        { action: 'italicizes', modifier: 'Ctrl+I', key: 'i', code: 'KeyI', ctrlKey: true, marker: '_' },
        { action: 'italicizes', modifier: 'Cmd+I', key: 'i', code: 'KeyI', metaKey: true, marker: '_' },
        { action: 'strikes through', modifier: 'Ctrl+S', key: 's', code: 'KeyS', ctrlKey: true, marker: '~~' },
        { action: 'strikes through', modifier: 'Cmd+S', key: 's', code: 'KeyS', metaKey: true, marker: '~~' },
      ])('$action selected text with $modifier', ({ key, code, ctrlKey, metaKey, marker }) => {
        expect.assertions(3)

        render(<CommentEditor />)

        const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

        fireEvent.change(textarea, { target: { value: 'hello world' } })
        textarea.setSelectionRange(0, 5) // Select 'hello'

        fireEvent.keyDown(textarea, { key, code, ctrlKey, metaKey })

        expect(textarea).toHaveValue(`${marker}hello${marker} world`)
        // Still selecting 'hello'
        expect(textarea.selectionStart).toBe(marker.length)
        expect(textarea.selectionEnd).toBe(5 + marker.length)
      })

      test.each([
        { action: 'bolds', key: 'b', code: 'KeyB', marker: '**' },
        { action: 'italicizes', key: 'i', code: 'KeyI', marker: '_' },
        { action: 'strikes through', key: 's', code: 'KeyS', marker: '~~' },
      ])('$action current word when no selection', ({ key, code, marker }) => {
        expect.assertions(3)

        render(<CommentEditor />)

        const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

        fireEvent.change(textarea, { target: { value: 'hello world' } })
        textarea.setSelectionRange(3, 3) // Caret is at 'hel|lo world'

        fireEvent.keyDown(textarea, { key, code, ctrlKey: true })

        expect(textarea).toHaveValue(`${marker}hello${marker} world`)

        // Should keep the caret at original position
        expect(textarea.selectionStart).toBe(marker.length + 3)
        expect(textarea.selectionEnd).toBe(marker.length + 3)
      })
    })

    describe('miscellaneous', () => {
      test('inserts new markers if no selection', () => {
        expect.assertions(3)

        render(<CommentEditor />)

        const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

        textarea.setSelectionRange(0, 0)

        fireEvent.keyDown(textarea, { key: 'b', code: 'KeyB', ctrlKey: true })

        expect(textarea).toHaveValue('****')
        expect(textarea.selectionStart).toBe(2)
        expect(textarea.selectionEnd).toBe(2)
      })

      test('removes markers if present and no selection', () => {
        expect.assertions(3)

        render(<CommentEditor />)

        const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

        fireEvent.change(textarea, { target: { value: '****' } })
        textarea.setSelectionRange(2, 2)

        fireEvent.keyDown(textarea, { key: 'b', code: 'KeyB', ctrlKey: true })

        expect(textarea).toHaveValue('')
        expect(textarea.selectionStart).toBe(0)
        expect(textarea.selectionEnd).toBe(0)
      })

      test('handles markers inside selection', () => {
        expect.assertions(3)

        render(<CommentEditor />)

        const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

        fireEvent.change(textarea, { target: { value: 'foo **hello** bar' } })
        textarea.setSelectionRange(4, 13) // Select '**hello**'

        fireEvent.keyDown(textarea, { key: 'b', code: 'KeyB', ctrlKey: true })

        expect(textarea).toHaveValue('foo hello bar')
        expect(textarea.selectionStart).toBe(4)
        expect(textarea.selectionEnd).toBe(9)
      })

      test('handles markers outside selection', () => {
        expect.assertions(3)

        render(<CommentEditor />)

        const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

        fireEvent.change(textarea, { target: { value: 'foo **hello** bar' } })
        textarea.setSelectionRange(6, 11) // Select 'hello'

        fireEvent.keyDown(textarea, { key: 'b', code: 'KeyB', ctrlKey: true })

        expect(textarea).toHaveValue('foo hello bar')
        expect(textarea.selectionStart).toBe(4)
        expect(textarea.selectionEnd).toBe(9)
      })
    })
  })

  describe('undo/redo', () => {
    test('undoes last input and restores selection (Ctrl/Cmd+Z)', () => {
      expect.assertions(4)

      render(<CommentEditor />)
      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')
      textarea.focus()

      fireEvent.change(textarea, { target: { value: 'foo' } })
      textarea.setSelectionRange(3, 3)
      fireEvent.input(textarea)

      fireEvent.change(textarea, { target: { value: 'bar' } })
      textarea.setSelectionRange(3, 3)
      fireEvent.input(textarea)

      // Undo with Ctrl+Z
      fireEvent.keyDown(textarea, { key: 'z', code: 'KeyZ', ctrlKey: true })

      expect(textarea).toHaveValue('foo')
      expect(textarea.selectionStart).toBe(3)

      // Undo with Cmd+Z
      fireEvent.keyDown(textarea, { key: 'z', code: 'KeyZ', metaKey: true })

      expect(textarea).toHaveValue('')
      expect(textarea.selectionStart).toBe(0)
    })

    test('redoes last undone change (Shift+Ctrl/Cmd+Z)', () => {
      expect.assertions(4)

      render(<CommentEditor />)
      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')
      textarea.focus()

      fireEvent.change(textarea, { target: { value: 'foo' } })
      textarea.setSelectionRange(3, 3)
      fireEvent.input(textarea)

      fireEvent.change(textarea, { target: { value: 'bar' } })
      textarea.setSelectionRange(3, 3)
      fireEvent.input(textarea)

      // Undo to 'foo'
      fireEvent.keyDown(textarea, { key: 'z', code: 'KeyZ', ctrlKey: true })

      expect(textarea).toHaveValue('foo')

      // Redo with Shift+Ctrl+Z
      fireEvent.keyDown(textarea, { key: 'z', code: 'KeyZ', ctrlKey: true, shiftKey: true })

      expect(textarea).toHaveValue('bar')
      expect(textarea.selectionStart).toBe(3)

      // Redo again with Shift+Cmd+Z should be a no-op (no more redo entries)
      fireEvent.keyDown(textarea, { key: 'z', code: 'KeyZ', metaKey: true, shiftKey: true })

      expect(textarea).toHaveValue('bar')
    })

    test('redoes last undone change (Ctrl/Cmd+Y)', () => {
      expect.assertions(3)

      render(<CommentEditor />)
      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')
      textarea.focus()

      fireEvent.change(textarea, { target: { value: 'foo' } })
      fireEvent.input(textarea)

      fireEvent.change(textarea, { target: { value: 'bar' } })
      fireEvent.input(textarea)

      // Undo to 'foo'
      fireEvent.keyDown(textarea, { key: 'z', code: 'KeyZ', ctrlKey: true })

      expect(textarea).toHaveValue('foo')

      // Redo with Ctrl+Y
      fireEvent.keyDown(textarea, { key: 'y', code: 'KeyY', ctrlKey: true })

      expect(textarea).toHaveValue('bar')

      // Redo again with Cmd+Y should be a no-op (no more redo entries)
      fireEvent.keyDown(textarea, { key: 'y', code: 'KeyY', metaKey: true })

      expect(textarea).toHaveValue('bar')
    })

    test('clears redo history after new input', () => {
      expect.assertions(3)

      render(<CommentEditor />)
      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')
      textarea.focus()

      fireEvent.change(textarea, { target: { value: 'foo' } })
      fireEvent.input(textarea)

      fireEvent.change(textarea, { target: { value: 'bar' } })
      fireEvent.input(textarea)

      // Undo to 'foo'
      fireEvent.keyDown(textarea, { key: 'z', code: 'KeyZ', ctrlKey: true })

      expect(textarea).toHaveValue('foo')

      // New input after undo clears redo stack
      fireEvent.change(textarea, { target: { value: 'foo-new' } })
      fireEvent.input(textarea)

      // Redo with Ctrl+Y should do nothing now
      fireEvent.keyDown(textarea, { key: 'y', code: 'KeyY', ctrlKey: true })

      expect(textarea).toHaveValue('foo-new')

      // Redo with Shift+Ctrl+Z should also do nothing
      fireEvent.keyDown(textarea, { key: 'z', code: 'KeyZ', ctrlKey: true, shiftKey: true })

      expect(textarea).toHaveValue('foo-new')
    })

    test('limits undo history to 100 changes', () => {
      expect.assertions(2)

      render(<CommentEditor />)
      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      for (let i = 1; i <= 105; i++) {
        fireEvent.change(textarea, { target: { value: `Change ${i}` } })
        fireEvent.input(textarea)
      }

      // Undo 100 times should reach "Change 6"
      for (let i = 0; i < 100; i++) {
        fireEvent.keyDown(textarea, { key: 'z', code: 'KeyZ', ctrlKey: true })
      }

      expect(textarea).toHaveValue('Change 6')

      // One more undo should do nothing (Change 5 is out of history)
      fireEvent.keyDown(textarea, { key: 'z', code: 'KeyZ', ctrlKey: true })

      expect(textarea).toHaveValue('Change 6')
    })
  })

  describe('input method editor (IME) composition', () => {
    test('groups IME input into a single history step and restores caret on undo/redo', () => {
      expect.assertions(10)

      render(<CommentEditor />)
      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')
      textarea.focus()

      // Initialize non-IME input as default state
      fireEvent.change(textarea, { target: { value: 'hello' } })
      textarea.setSelectionRange(5, 5)
      fireEvent.input(textarea)

      // Compose first character
      simulateIMEInput({
        textarea,
        textValue: '你',
        intermediateData: '丿丨丿乛丨丿丶',
        composedText: '你',
        caretPosition: 1,
      })

      // Verify composed value and caret
      expect(textarea).toHaveValue('你')
      expect(textarea.selectionStart).toBe(1)

      // Compose second character
      simulateIMEInput({
        textarea,
        textValue: '你好',
        intermediateData: '乛丿一乛丨一',
        composedText: '好',
        caretPosition: 2,
      })

      // Verify composed value and caret
      expect(textarea).toHaveValue('你好')
      expect(textarea.selectionStart).toBe(2)

      // Undo should revert to first character and restore caret
      fireEvent.keyDown(textarea, { key: 'z', code: 'KeyZ', ctrlKey: true })

      expect(textarea).toHaveValue('你')
      expect(textarea.selectionStart).toBe(1)

      // Undo should revert to non-IME input and restore caret
      fireEvent.keyDown(textarea, { key: 'z', code: 'KeyZ', ctrlKey: true })

      expect(textarea).toHaveValue('hello')
      expect(textarea.selectionStart).toBe(5)

      // Redo should reapply first character and restore caret
      fireEvent.keyDown(textarea, { key: 'y', code: 'KeyY', ctrlKey: true })

      expect(textarea).toHaveValue('你')
      expect(textarea.selectionStart).toBe(1)
    })

    test('clears redo after new input following IME undo', () => {
      expect.assertions(4)

      render(<CommentEditor />)
      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')
      textarea.focus()

      // Compose three characters
      simulateIMEInput({
        textarea,
        textValue: '你',
        intermediateData: '丿丨丿乛丨丿丶',
        composedText: '你',
        caretPosition: 1,
      })
      simulateIMEInput({
        textarea,
        textValue: '你好',
        intermediateData: '乛丿一乛丨一',
        composedText: '好',
        caretPosition: 2,
      })
      simulateIMEInput({
        textarea,
        textValue: '你好嗎',
        intermediateData: '丨乛一一丨一一丨乛丶丶丶丶',
        composedText: '嗎',
        caretPosition: 3,
      })

      // Undo back to second character
      fireEvent.keyDown(textarea, { key: 'z', code: 'KeyZ', ctrlKey: true })

      expect(textarea).toHaveValue('你好')
      expect(textarea.selectionStart).toBe(2)

      // New non-IME input after undo should clear redo stack
      fireEvent.change(textarea, { target: { value: '你好!' } })
      textarea.setSelectionRange(3, 3)
      fireEvent.input(textarea)

      // Redo should now do nothing
      fireEvent.keyDown(textarea, { key: 'y', code: 'KeyY', ctrlKey: true })

      expect(textarea).toHaveValue('你好!')
      expect(textarea.selectionStart).toBe(3)
    })
  })

  describe('preview mode', () => {
    test('renders markdown preview when in preview mode', () => {
      expect.assertions(6)

      render(<CommentEditor value='**bold** _italic_ ~~strikethrough~~' tabsValue='preview' />)

      expect(screen.getByText('bold')).toBeInTheDocument()
      expect(screen.getByText('italic')).toBeInTheDocument()
      expect(screen.getByText('strikethrough')).toBeInTheDocument()

      const boldElement = screen.getByText('bold')

      expect(boldElement.tagName).toBe('STRONG')

      const italicElement = screen.getByText('italic')

      expect(italicElement.tagName).toBe('EM')

      const strikeElement = screen.getByText('strikethrough')

      expect(strikeElement.tagName).toBe('DEL')
    })

    test('shows placeholder text when previewing empty content', () => {
      expect.assertions(1)

      render(<CommentEditor value=' ' tabsValue='preview' />)

      expect(screen.getByText('Nothing to preview')).toBeInTheDocument()
    })
  })
})
