export type IndicatorStatus = 'high' | 'normal' | 'low' | 'unavailable' | string

export interface IndicatorResult {
  name: string
  slug: string
  category: string
  markets: string[]
  threshold?: string | null
  status?: IndicatorStatus | null
  notes?: string | null
  raw_value?: string | null
  pure_value?: Array<Record<string, unknown>>
  topics?: string[]
  description?: string | null
}

export interface IndicatorListResponse {
  generated_at: string
  indicators: IndicatorResult[]
}

export type IndicatorDetailResponse = IndicatorResult

export interface IndicatorHistoryPoint {
  date: string
  status?: IndicatorStatus | null
  summary_value?: number | null
  details?: Record<string, unknown>
}

export interface IndicatorHistoryResponse {
  indicator: string
  display_name: string
  category: string
  markets: string[]
  topics?: string[]
  threshold?: string | null
  updated_at?: string
  series: IndicatorHistoryPoint[]
}

export interface CategorySummaryBreakdown {
  high: number
  normal: number
  unavailable: number
}

export interface MarketSummaryResponse {
  generated_at: string
  mode: string
  summary: {
    triggered_total: number
    total_total: number
    triggered_available: number
    total_available: number
    ratio_total: string
    ratio_available: string
    by_category: Record<string, CategorySummaryBreakdown>
  }
}
