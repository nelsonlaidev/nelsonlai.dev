import { useSyncExternalStore } from 'react'

function subscribe() {
  return () => {}
}

export function useIsHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
