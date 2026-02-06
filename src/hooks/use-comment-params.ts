import { parseAsString, useQueryStates } from 'nuqs'

export function useCommentParams() {
  return useQueryStates({
    comment: parseAsString,
    reply: parseAsString,
  })
}
