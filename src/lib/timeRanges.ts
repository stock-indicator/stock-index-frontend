export interface TimeRangeOption {
  id: TimeRangeId
  label: string
  lookbackDays?: number
}

export type TimeRangeId = '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y' | '10Y' | 'MAX'

export const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { id: '1W', label: '1W', lookbackDays: 7 },
  { id: '1M', label: '1M', lookbackDays: 30 },
  { id: '3M', label: '3M', lookbackDays: 90 },
  { id: '6M', label: '6M', lookbackDays: 180 },
  { id: '1Y', label: '1Y', lookbackDays: 365 },
  { id: '5Y', label: '5Y', lookbackDays: 1825 },
  { id: '10Y', label: '10Y', lookbackDays: 3650 },
  { id: 'MAX', label: 'Max' },
]

// Points requested per chart. Daily series reach back decades, far more points
// than a chart can show; the engine thins them and keeps high/low signals.
export const DETAIL_CHART_MAX_POINTS = 1500
export const GRID_CHART_MAX_POINTS = 600
export const CARD_CHART_MAX_POINTS = 300

const DAY_MS = 24 * 60 * 60 * 1000

// Date format for chart ticks that suits the span on screen: day precision
// for a year or less, month and year beyond that.
export function getDateTickFormat(firstMs: number, lastMs: number, compact = false) {
  const spanDays = (lastMs - firstMs) / DAY_MS
  if (spanDays > 3 * 365) return 'yyyy'
  if (spanDays > 365) return compact ? 'MM/yy' : 'MMM yyyy'
  return compact ? 'MM/dd' : 'MMM d, yyyy'
}

export function getLookbackDays(rangeId: TimeRangeId) {
  return TIME_RANGE_OPTIONS.find((option) => option.id === rangeId)?.lookbackDays
}
