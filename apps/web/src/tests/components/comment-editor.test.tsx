import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import CommentEditor from '@/components/comment-section/comment-editor'
import { render } from '@/utils/render'

describe('<CommentEditor />', () => {
  describe('basic behavior', () => {
    it('should render the Textarea and decoration buttons', () => {
      render(<CommentEditor />)

      const textarea = screen.getByTestId('comment-editor-textarea')
      expect(textarea).toBeInTheDocument()

      expect(screen.getByLabelText('Toggle bold')).toBeInTheDocument()
      expect(screen.getByLabelText('Toggle strikethrough')).toBeInTheDocument()
      expect(screen.getByLabelText('Toggle italic')).toBeInTheDocument()
    })

    it('should insert two spaces when Tab is pressed', () => {
      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')
      textarea.focus()

      fireEvent.change(textarea, { target: { value: 'test' } })
      textarea.setSelectionRange(0, 0) // Move cursor to the start

      fireEvent.keyDown(textarea, { key: 'Tab', code: 'Tab', charCode: 9 })
      expect(textarea).toHaveValue('  test')
      expect(textarea.selectionStart).toBe(2)
    })

    it('should call onEscape when Escape is pressed', () => {
      const onEscape = vi.fn()

      render(<CommentEditor onEscape={onEscape} />)

      const textarea = screen.getByTestId('comment-editor-textarea')
      textarea.focus()

      fireEvent.keyDown(textarea, { key: 'Escape', code: 'Escape' })
      expect(onEscape).toHaveBeenCalledTimes(1)
    })

    it('should call onModEnter when Cmd/Ctrl + Enter is pressed', () => {
      const onModEnter = vi.fn()

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

  describe('list operations', () => {
    it('should remove list item if Enter is pressed on an empty list item', () => {
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

      // Checked task list (capitalized)
      fireEvent.change(textarea, { target: { value: '- [X]\n- [X] ' } })
      textarea.setSelectionRange(12, 12)
      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })
      expect(textarea).toHaveValue('- [X]\n')

      // Complex case
      fireEvent.change(textarea, { target: { value: '- 123\n- 123\n- \n\n- 123\n- 123' } })
      textarea.setSelectionRange(14, 14)
      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })
      expect(textarea).toHaveValue('- 123\n- 123\n\n\n- 123\n- 123')
    })

    it('should create a new unordered list item on Enter', () => {
      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: '* Item 1' } })
      textarea.setSelectionRange(8, 8)

      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })
      expect(textarea).toHaveValue('* Item 1\n* ')
      expect(textarea.selectionStart).toBe(11)
    })

    it('should create a new ordered list item on Enter', () => {
      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: '1. First item' } })
      textarea.setSelectionRange(14, 14) // Move cursor to the end

      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })
      expect(textarea).toHaveValue('1. First item\n2. ')
      expect(textarea.selectionStart).toBe(17)
    })

    it('should create a new task list item on Enter', () => {
      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: '- [ ] Task 1' } })
      textarea.setSelectionRange(12, 12)

      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })
      expect(textarea).toHaveValue('- [ ] Task 1\n- [ ] ')
      expect(textarea.selectionStart).toBe(19)
    })

    it('should create a new checked task list item on Enter', () => {
      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: '- [x] Completed task' } })
      textarea.setSelectionRange(20, 20)

      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })
      expect(textarea).toHaveValue('- [x] Completed task\n- [ ] ')
      expect(textarea.selectionStart).toBe(27)
    })

    it('should create a new checked task list (capitalized) item on Enter', () => {
      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: '- [X] Completed task' } })
      textarea.setSelectionRange(20, 20)

      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })
      expect(textarea).toHaveValue('- [X] Completed task\n- [ ] ')
      expect(textarea.selectionStart).toBe(27)
    })

    it('should split list item when Enter is pressed in the middle of a list item', () => {
      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: '- 1234' } })
      textarea.setSelectionRange(4, 4) // Cursor is at '- 12|34'

      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })
      expect(textarea).toHaveValue('- 12\n- 34')
      expect(textarea.selectionStart).toBe(7) // Cursor is at '- 12\n- |34'
    })
  })

  describe('text formatting - button actions', () => {
    it('should bold selected text when bold button is clicked', () => {
      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: 'hello world' } })
      textarea.setSelectionRange(0, 5) // Select 'hello'

      const boldButton = screen.getByLabelText('Toggle bold')
      fireEvent.click(boldButton)

      expect(textarea).toHaveValue('**hello** world')
      expect(textarea.selectionStart).toBe(9) // Cursor is at '**hello**| world'
    })

    it('should insert bold markdown at cursor position when bold button is clicked with no selection', () => {
      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: 'test' } })
      textarea.setSelectionRange(2, 2) // Cursor is at 'te|st'

      const boldButton = screen.getByLabelText('Toggle bold')
      fireEvent.click(boldButton)

      expect(textarea).toHaveValue('te****st')
      expect(textarea.selectionStart).toBe(4) // Cursor is at 'te**|**st'
    })

    it('should italicize selected text when italic button is clicked', () => {
      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: 'hello world' } })
      textarea.setSelectionRange(0, 5) // Select 'hello'

      const italicButton = screen.getByLabelText('Toggle italic')
      fireEvent.click(italicButton)

      expect(textarea).toHaveValue('_hello_ world')
      expect(textarea.selectionStart).toBe(7) // Cursor is at '_hello_| world'
    })

    it('should insert italic markdown at cursor position when italic button is clicked with no selection', () => {
      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: 'test' } })
      textarea.setSelectionRange(2, 2) // Cursor is at 'te|st'

      const italicButton = screen.getByLabelText('Toggle italic')
      fireEvent.click(italicButton)

      expect(textarea).toHaveValue('te__st')
      expect(textarea.selectionStart).toBe(3) // Cursor is at 'te_|_st'
    })

    it('should strikethrough selected text when strikethrough button is clicked', () => {
      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: 'hello world' } })
      textarea.setSelectionRange(0, 5) // Select 'hello'

      const strikethroughButton = screen.getByLabelText('Toggle strikethrough')
      fireEvent.click(strikethroughButton)

      expect(textarea).toHaveValue('~~hello~~ world')
      expect(textarea.selectionStart).toBe(9) // Cursor is at '~~hello~~| world'
    })

    it('should insert strikethrough markdown at cursor position when strikethrough button is clicked with no selection', () => {
      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: 'test' } })
      textarea.setSelectionRange(2, 2) // Cursor is at 'te|st'

      const strikethroughButton = screen.getByLabelText('Toggle strikethrough')
      fireEvent.click(strikethroughButton)

      expect(textarea).toHaveValue('te~~~~st')
      expect(textarea.selectionStart).toBe(4) // Cursor is at 'te~~|~~st'
    })
  })

  describe('text formatting - keyboard shortcuts', () => {
    it('should bold selected text when Ctrl+B is pressed', () => {
      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: 'hello world' } })
      textarea.setSelectionRange(0, 5) // Select 'hello'

      fireEvent.keyDown(textarea, { key: 'b', code: 'KeyB', ctrlKey: true })
      expect(textarea).toHaveValue('**hello** world')
      expect(textarea.selectionStart).toBe(9) // Cursor is at '**hello**| world'
    })

    it('should bold selected text when Cmd+B is pressed', () => {
      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: 'hello world' } })
      textarea.setSelectionRange(0, 5) // Select 'hello'

      fireEvent.keyDown(textarea, { key: 'b', code: 'KeyB', metaKey: true })
      expect(textarea).toHaveValue('**hello** world')
      expect(textarea.selectionStart).toBe(9) // Cursor is at '**hello**| world'
    })

    it('should insert bold markdown at cursor position when Ctrl+B is pressed with no selection', () => {
      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: 'test' } })
      textarea.setSelectionRange(2, 2) // Cursor is at 'te|st'

      fireEvent.keyDown(textarea, { key: 'b', code: 'KeyB', ctrlKey: true })
      expect(textarea).toHaveValue('te****st')
      expect(textarea.selectionStart).toBe(4) // Cursor is at 'te**|**st'
    })

    it('should italicize selected text when Ctrl+I is pressed', () => {
      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: 'hello world' } })
      textarea.setSelectionRange(0, 5) // Select 'hello'

      fireEvent.keyDown(textarea, { key: 'i', code: 'KeyI', ctrlKey: true })
      expect(textarea).toHaveValue('_hello_ world')
      expect(textarea.selectionStart).toBe(7) // Cursor is at '_hello_| world'
    })

    it('should italicize selected text when Cmd+I is pressed', () => {
      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: 'hello world' } })
      textarea.setSelectionRange(0, 5) // Select 'hello'

      fireEvent.keyDown(textarea, { key: 'i', code: 'KeyI', metaKey: true })
      expect(textarea).toHaveValue('_hello_ world')
      expect(textarea.selectionStart).toBe(7) // Cursor is at '_hello_| world'
    })

    it('should insert italic markdown at cursor position when Ctrl+I is pressed with no selection', () => {
      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: 'test' } })
      textarea.setSelectionRange(2, 2) // Cursor is at 'te|st'

      fireEvent.keyDown(textarea, { key: 'i', code: 'KeyI', ctrlKey: true })
      expect(textarea).toHaveValue('te__st')
      expect(textarea.selectionStart).toBe(3) // Cursor is at 'te_|_st'
    })

    it('should strikethrough selected text when Ctrl+S is pressed', () => {
      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: 'hello world' } })
      textarea.setSelectionRange(0, 5) // Select 'hello'

      fireEvent.keyDown(textarea, { key: 's', code: 'KeyS', ctrlKey: true })
      expect(textarea).toHaveValue('~~hello~~ world')
      expect(textarea.selectionStart).toBe(9) // Cursor is at '~~hello~~| world'
    })

    it('should strikethrough selected text when Cmd+S is pressed', () => {
      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: 'hello world' } })
      textarea.setSelectionRange(0, 5) // Select 'hello'

      fireEvent.keyDown(textarea, { key: 's', code: 'KeyS', metaKey: true })
      expect(textarea).toHaveValue('~~hello~~ world')
      expect(textarea.selectionStart).toBe(9) // Cursor is at '~~hello~~| world'
    })

    it('should insert strikethrough markdown at cursor position when Ctrl+S is pressed with no selection', () => {
      render(<CommentEditor />)

      const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

      fireEvent.change(textarea, { target: { value: 'test' } })
      textarea.setSelectionRange(2, 2) // Cursor is at 'te|st'

      fireEvent.keyDown(textarea, { key: 's', code: 'KeyS', ctrlKey: true })
      expect(textarea).toHaveValue('te~~~~st')
      expect(textarea.selectionStart).toBe(4) // Cursor is at 'te~~|~~st'
    })
  })

  describe('undo/redo', () => {
    it('should undo last input and restore selection with Ctrl/Cmd+Z', () => {
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

    it('should redo last undone change with Shift+Ctrl/Cmd+Z', () => {
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

    it('should redo last undone change with Ctrl/Cmd+Y', () => {
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

    it('should clear redo history after new input following undo', () => {
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
  })
})
