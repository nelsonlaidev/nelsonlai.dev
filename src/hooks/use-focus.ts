import { useEffect, useRef } from 'react'

export function useFocus<T extends HTMLTextAreaElement | HTMLInputElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.focus()

      const length = ref.current.value.length
      ref.current.setSelectionRange(length, length)
    }
  }, [])

  return ref
}
