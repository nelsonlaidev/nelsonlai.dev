import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import CommentEditor from '@/components/comment-section/comment-editor'
import { render } from '@/utils/render'

describe('<CommentEditor />', () => {
  it('should render the Textarea and decoration buttons', () => {
    render(<CommentEditor />)

    const textarea = screen.getByTestId('comment-editor-textarea')
    expect(textarea).toBeInTheDocument()

    expect(screen.getByLabelText('Toggle bold')).toBeInTheDocument()
    expect(screen.getByLabelText('Toggle strikethrough')).toBeInTheDocument()
    expect(screen.getByLabelText('Toggle italic')).toBeInTheDocument()
  })

  it('should display initialValue in the textarea', () => {
    const initialValue = 'Hello, world!'
    render(<CommentEditor initialValue={initialValue} />)

    const textarea = screen.getByTestId('comment-editor-textarea')
    expect(textarea).toHaveValue(initialValue)
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

  it('should remove list item if Enter is pressed on an empty list item', () => {
    render(<CommentEditor />)
    const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

    // Unordered list
    fireEvent.change(textarea, { target: { value: '- ' } })
    textarea.setSelectionRange(2, 2)
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })
    expect(textarea).toHaveValue('')

    // Ordered list
    fireEvent.change(textarea, { target: { value: '1. ' } })
    textarea.setSelectionRange(3, 3)
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })
    expect(textarea).toHaveValue('')

    // Task list
    fireEvent.change(textarea, { target: { value: '- [ ] ' } })
    textarea.setSelectionRange(6, 6)
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })
    expect(textarea).toHaveValue('')
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

    expect(textarea).toHaveValue('*hello* world')
    expect(textarea.selectionStart).toBe(7) // Cursor is at '*hello*| world'
  })

  it('should insert italic markdown at cursor position when italic button is clicked with no selection', () => {
    render(<CommentEditor />)

    const textarea = screen.getByTestId<HTMLTextAreaElement>('comment-editor-textarea')

    fireEvent.change(textarea, { target: { value: 'test' } })
    textarea.setSelectionRange(2, 2) // Cursor is at 'te|st'

    const italicButton = screen.getByLabelText('Toggle italic')
    fireEvent.click(italicButton)

    expect(textarea).toHaveValue('te**st')
    expect(textarea.selectionStart).toBe(3) // Cursor is at 'te*|*st'
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
