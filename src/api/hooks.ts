import { keepPreviousData, useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  fetchIndicator,
  fetchIndicatorHistory,
  fetchIndicators,
  fetchSummary,
  refreshIndicator,
  refreshManual,
  type FetchHistoryParams,
} from './queries'

export function useIndicatorsQuery() {
  return useQuery({
    queryKey: ['indicators', 'latest'],
    queryFn: fetchIndicators,
    placeholderData: keepPreviousData,
  })
}

export function useMarketSummaryQuery() {
  return useQuery({
    queryKey: ['summary', 'latest'],
    queryFn: fetchSummary,
    placeholderData: keepPreviousData,
  })
}

export function useIndicatorDetailQuery(slug?: string) {
  return useQuery({
    queryKey: ['indicator', slug],
    queryFn: () => {
      if (!slug) throw new Error('Missing indicator slug')
      return fetchIndicator(slug)
    },
    enabled: Boolean(slug),
  })
}

export function useIndicatorHistoryQuery({ slug, lookbackDays }: FetchHistoryParams) {
  return useQuery({
    queryKey: ['indicator-history', slug, lookbackDays ?? 'all'],
    queryFn: () => fetchIndicatorHistory({ slug, lookbackDays }),
    enabled: Boolean(slug),
    placeholderData: keepPreviousData,
  })
}

export function useBulkIndicatorHistoryQueries(
  items: FetchHistoryParams[],
  enabled = true,
) {
  return useQueries({
    queries: items.map(({ slug, lookbackDays }) => ({
      queryKey: ['indicator-history', slug, lookbackDays ?? 'all'],
      queryFn: () => fetchIndicatorHistory({ slug, lookbackDays }),
      enabled: enabled && Boolean(slug),
    })),
  })
}

export function useManualRefreshMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: refreshManual,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicators', 'latest'] })
      queryClient.invalidateQueries({ queryKey: ['summary', 'latest'] })
    },
  })
}

export function useIndicatorRefreshMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: refreshIndicator,
    onSuccess: (_, slug) => {
      queryClient.invalidateQueries({ queryKey: ['indicator', slug] })
      queryClient.invalidateQueries({ queryKey: ['indicator-history', slug] })
    },
  })
}
