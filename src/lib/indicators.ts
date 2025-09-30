import type { IndicatorResult, IndicatorStatus } from '../api/types'

export type IndicatorTone = 'positive' | 'negative' | 'neutral' | 'unknown'

export function formatIndicatorStatus(status?: IndicatorStatus | null) {
  if (!status) return 'Unknown'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export function getIndicatorTone(status?: IndicatorStatus | null): IndicatorTone {
  if (!status) return 'unknown'
  const normalised = status.toLowerCase()

  if (normalised === 'high') return 'negative'
  if (normalised === 'low') return 'positive'
  if (normalised === 'normal') return 'neutral'
  if (normalised === 'unavailable') return 'unknown'

  return 'neutral'
}

const STATUS_PRIORITY: Record<string, number> = {
  high: 0,
  low: 1,
  normal: 2,
  unavailable: 3,
}

export function getStatusSortWeight(status?: IndicatorStatus | null) {
  if (!status) return STATUS_PRIORITY.unavailable
  return STATUS_PRIORITY[status.toLowerCase()] ?? STATUS_PRIORITY.normal
}

export function sortIndicators(a: IndicatorResult, b: IndicatorResult) {
  const statusWeight = getStatusSortWeight(a.status) - getStatusSortWeight(b.status)
  if (statusWeight !== 0) return statusWeight
  return a.name.localeCompare(b.name)
}

export function groupIndicatorsByCategory(indicators: IndicatorResult[]) {
  return indicators.reduce<Record<string, IndicatorResult[]>>((acc, indicator) => {
    const bucket = indicator.category ?? 'Other'
    if (!acc[bucket]) {
      acc[bucket] = []
    }
    acc[bucket].push(indicator)
    return acc
  }, {})
}
