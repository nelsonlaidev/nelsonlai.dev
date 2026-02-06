import { createLoader, parseAsString } from 'nuqs/server'

const unsubscribeParams = {
  token: parseAsString,
}

export const loadUnsubscribeParams = createLoader(unsubscribeParams)
