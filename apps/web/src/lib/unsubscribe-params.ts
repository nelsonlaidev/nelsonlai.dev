import { createLoader, parseAsString } from 'nuqs/server'

export const unsubscribeParams = {
  token: parseAsString
}

export const loadUnsubscribeParams = createLoader(unsubscribeParams)
