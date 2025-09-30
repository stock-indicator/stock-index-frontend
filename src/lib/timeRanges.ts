export interface TimeRangeOption {
  id: TimeRangeId
  label: string
  lookbackDays?: number
}

export type TimeRangeId = '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y' | 'MAX'

export const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { id: '1W', label: '1W', lookbackDays: 7 },
  { id: '1M', label: '1M', lookbackDays: 30 },
  { id: '3M', label: '3M', lookbackDays: 90 },
  { id: '6M', label: '6M', lookbackDays: 180 },
  { id: '1Y', label: '1Y', lookbackDays: 365 },
  { id: '5Y', label: '5Y', lookbackDays: 1825 },
  { id: 'MAX', label: 'Max' },
]

export function getLookbackDays(rangeId: TimeRangeId) {
  return TIME_RANGE_OPTIONS.find((option) => option.id === rangeId)?.lookbackDays
}
