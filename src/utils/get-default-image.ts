import { getBaseUrl } from './get-base-url'

export function getDefaultImage(id: string) {
  return `${getBaseUrl()}/api/avatar/${id}`
}
