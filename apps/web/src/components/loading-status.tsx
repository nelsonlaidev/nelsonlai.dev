import { m } from '@/paraglide/messages'

export function LoadingStatus() {
  return (
    <span
      // Announce pending work as a status.
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role='status'
      className='sr-only'
    >
      {m.common_aria_labels_loading()}
    </span>
  )
}
