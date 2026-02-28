import { useQuery } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useYoutubeStats() {
  return useQuery(orpc.youtube.getStats.queryOptions())
}

export function useGithubStats() {
  return useQuery(orpc.github.getStats.queryOptions())
}

export function useLikeStats() {
  return useQuery(orpc.like.getStats.queryOptions())
}

export function useViewStats() {
  return useQuery(orpc.view.getStats.queryOptions())
}

export function useWakatimeStats() {
  return useQuery(orpc.wakatime.getStats.queryOptions())
}

export function useSpotifyStats() {
  return useQuery(orpc.spotify.getStats.queryOptions())
}
