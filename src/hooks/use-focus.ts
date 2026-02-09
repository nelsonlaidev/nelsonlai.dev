import { useEffect, useRef } from 'react'

export function useFocus<T extends HTMLTextAreaElement | HTMLInputElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current

    if (el) {
      el.focus()
      const { length } = el.value

      el.setSelectionRange(length, length)
    }
  }, [])

  return ref
}
