import { apiClient } from './client.ts'
import type {
  IndicatorListResponse,
  IndicatorDetailResponse,
  IndicatorHistoryResponse,
  MarketSummaryResponse,
} from './types.ts'

export async function fetchIndicators() {
  const { data } = await apiClient.get<IndicatorListResponse>('/indicators')
  return data
}

export async function fetchIndicator(slug: string) {
  const { data } = await apiClient.get<IndicatorDetailResponse>(`/indicators/${slug}`)
  return data
}

export interface FetchHistoryParams {
  slug: string
  lookbackDays?: number
}

export async function fetchIndicatorHistory({ slug, lookbackDays }: FetchHistoryParams) {
  const { data } = await apiClient.get<IndicatorHistoryResponse>(
    `/indicators/${slug}/history`,
    {
      params: lookbackDays ? { lookback_days: lookbackDays } : undefined,
    },
  )

  return data
}

export async function fetchSummary() {
  const { data } = await apiClient.get<MarketSummaryResponse>('/summary')
  return data
}

export async function refreshManual() {
  const { data } = await apiClient.post('/refresh', {
    mode: 'manual',
    lookback_days: 365,
    indicator_slug: null,
  })
  return data
}

export async function refreshIndicator(slug: string) {
  const { data } = await apiClient.post('/refresh', {
    mode: 'manual',
    lookback_days: 365,
    indicator_slug: slug,
  })
  return data
}
