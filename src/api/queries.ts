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
  maxPoints?: number
}

export async function fetchIndicatorHistory({ slug, lookbackDays, maxPoints }: FetchHistoryParams) {
  const { data } = await apiClient.get<IndicatorHistoryResponse>(
    `/indicators/${slug}/history`,
    {
      params: {
        ...(lookbackDays ? { lookback_days: lookbackDays } : {}),
        ...(maxPoints ? { max_points: maxPoints } : {}),
      },
    },
  )

  return data
}

export async function fetchSummary() {
  const { data } = await apiClient.get<MarketSummaryResponse>('/summary')
  return data
}

export async function refreshManual() {
  // const { data } = await apiClient.post('/refresh', {
  //   mode: 'manual',
  //   lookback_days: 365,
  //   indicator_slug: null,
  // })
  // return data
  return Promise.resolve({ message: "Manual refresh is temporarily disabled." });
}

export async function refreshIndicator(slug: string) {
  // const { data } = await apiClient.post('/refresh', {
  //   mode: 'manual',
  //   lookback_days: 365,
  //   indicator_slug: slug,
  // })
  // return data
  console.log(`Refresh called for ${slug}, but is disabled.`);
  return Promise.resolve({ message: `Indicator refresh for ${slug} is temporarily disabled.` });
}
