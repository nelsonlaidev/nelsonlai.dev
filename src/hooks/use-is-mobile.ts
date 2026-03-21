import { useSyncExternalStore } from 'react'

const MOBILE_BREAKPOINT = 768

function subscribe(onStoreChange: () => void) {
  const mql = globalThis.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mql.addEventListener('change', onStoreChange)
  return () => {
    mql.removeEventListener('change', onStoreChange)
  }
}

function getSnapshot() {
  return window.innerWidth < MOBILE_BREAKPOINT
}

function getServerSnapshot() {
  return false
}

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
