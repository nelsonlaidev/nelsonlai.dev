import { m } from '@/paraglide/messages'

export function SkipNav() {
  return (
    <a
      href='#main-content'
      className='fixed top-4 left-4 z-50 -translate-y-20 rounded-md border bg-background px-3 py-2 font-medium transition-transform focus:outline-none focus-visible:translate-y-0 focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2'
    >
      {m.a11y_skip_to_content()}
    </a>
  )
}
