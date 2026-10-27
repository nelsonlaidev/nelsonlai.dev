import { useSyncExternalStore } from 'react'

const MOBILE_QUERY = '(width < 768px)'

function subscribe(onStoreChange: () => void) {
  const mediaQuery = globalThis.matchMedia(MOBILE_QUERY)
  mediaQuery.addEventListener('change', onStoreChange)
  return () => {
    mediaQuery.removeEventListener('change', onStoreChange)
  }
}

function getSnapshot() {
  return globalThis.matchMedia(MOBILE_QUERY).matches
}

function getServerSnapshot() {
  return false
}

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
