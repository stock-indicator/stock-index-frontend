import { TogglePillGroup } from './TogglePillGroup'
import type { TimeRangeId } from '../../lib/timeRanges'
import { TIME_RANGE_OPTIONS } from '../../lib/timeRanges'

interface TimeRangePickerProps {
  value: TimeRangeId
  onChange: (value: TimeRangeId) => void
}

export function TimeRangePicker({ value, onChange }: TimeRangePickerProps) {
  return (
    <TogglePillGroup
      options={TIME_RANGE_OPTIONS.map((option) => ({
        value: option.id,
        label: option.label,
      }))}
      value={value}
      onChange={(next) => onChange(next as TimeRangeId)}
    />
  )
}
