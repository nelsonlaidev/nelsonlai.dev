import { useQuery } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useYoutubeStats() {
  return useQuery(orpc.youtube.stats.queryOptions({ refetchOnWindowFocus: false }))
}

export function useGithubStats() {
  return useQuery(orpc.github.stats.queryOptions({ refetchOnWindowFocus: false }))
}

export function useLikeStats() {
  return useQuery(orpc.like.stats.queryOptions())
}

export function useViewStats() {
  return useQuery(orpc.view.stats.queryOptions())
}

export function useWakatimeStats() {
  return useQuery(orpc.wakatime.stats.queryOptions({ refetchOnWindowFocus: false }))
}

export function useSpotifyStats() {
  return useQuery(orpc.spotify.stats.queryOptions())
}
