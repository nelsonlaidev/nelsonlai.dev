import { useQuery } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useYoutubeStat() {
  return useQuery(orpc.stats.youtube.queryOptions())
}

export function useGitHubStat() {
  return useQuery(orpc.stats.github.queryOptions())
}

export function useBlogLikeStat() {
  return useQuery(orpc.stats.blog.likes.queryOptions())
}

export function useBlogViewStat() {
  return useQuery(orpc.stats.blog.views.queryOptions())
}

export function useWakatimeStat() {
  return useQuery(orpc.stats.wakatime.queryOptions())
}

export function useSpotifyStat() {
  return useQuery(orpc.stats.spotify.queryOptions())
}
