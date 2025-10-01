import { format } from 'date-fns'
import type { DotProps } from 'recharts'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { IndicatorHistoryPoint, IndicatorStatus } from '../../api/types'
import { formatIndicatorStatus, getIndicatorTone } from '../../lib/indicators'

import styles from './IndicatorHistoryChart.module.css'

interface IndicatorHistoryChartProps {
  series: IndicatorHistoryPoint[]
  height?: number
}

interface ChartDatum {
  date: number
  value: number | null
  status?: IndicatorStatus | null
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ payload: ChartDatum }>
}

interface HistoryDotProps extends DotProps {
  payload?: ChartDatum
}

function buildChartData(series: IndicatorHistoryPoint[]): ChartDatum[] {
  return series.map((point) => ({
    date: new Date(point.date).getTime(),
    value: typeof point.summary_value === 'number' ? point.summary_value : null,
    status: point.status,
  }))
}

function getStatusColor(status?: IndicatorStatus | null) {
  const tone = getIndicatorTone(status)
  if (tone === 'negative') return '#f05a7e'
  if (tone === 'positive') return '#0fba81'
  if (tone === 'neutral') return '#7aa2ff'
  return '#b1bbd4'
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null
  }

  const datum = payload[0]?.payload
  if (!datum) {
    return null
  }

  const formattedDate = format(new Date(datum.date), 'PPPP')
  const formattedValue =
    typeof datum.value === 'number' ? datum.value.toLocaleString() : 'N/A'

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipDate}>{formattedDate}</p>
      <p className={styles.tooltipValue}>{formattedValue}</p>
      <p className={styles.tooltipStatus}>{formatIndicatorStatus(datum.status)}</p>
    </div>
  )
}

function HistoryDot({ cx, cy, payload }: HistoryDotProps) {
  if (payload?.value == null || cx == null || cy == null) {
    return null
  }

  const color = getStatusColor(payload.status)

  return (
    <circle cx={cx} cy={cy} r={4} fill={color} stroke="#0f1629" strokeWidth={1.5} />
  )
}

export function IndicatorHistoryChart({ series, height = 320 }: IndicatorHistoryChartProps) {
  const data = buildChartData(series)

  return (
    <div className={styles.chartWrapper} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 16, right: 24, top: 16, bottom: 8 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis
            dataKey="date"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            stroke="rgba(255,255,255,0.55)"
            tickLine={false}
            axisLine={false}
            minTickGap={32}
            tickFormatter={(value: number) => format(new Date(value), 'MMM d, yyyy')}
          />
          <YAxis
            stroke="rgba(255,255,255,0.55)"
            tickLine={false}
            axisLine={false}
            width={72}
            tickFormatter={(value: number) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)' }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#7aa2ff"
            strokeWidth={2}
            connectNulls
            isAnimationActive={false}
            dot={(props) => <HistoryDot {...(props as HistoryDotProps)} />}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
