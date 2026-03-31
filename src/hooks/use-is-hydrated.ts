import { useSyncExternalStore } from 'react'

function noop() {
  // No-op
}

function subscribe() {
  return noop
}

export function useIsHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
