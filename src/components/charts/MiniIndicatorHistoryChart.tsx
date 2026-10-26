import { ResponsiveContainer, LineChart, Line, Tooltip, YAxis, XAxis, CartesianGrid } from 'recharts'
import { format } from 'date-fns'

import type { IndicatorHistoryPoint } from '../../api/types'
import { getDateTickFormat } from '../../lib/timeRanges'

import styles from './MiniIndicatorHistoryChart.module.css'

interface MiniIndicatorHistoryChartProps {
  series: IndicatorHistoryPoint[]
}

const tooltipFormatter = (value: unknown) => {
  if (typeof value === 'number') return value.toLocaleString()
  return value == null ? '' : String(value)
}

export function MiniIndicatorHistoryChart({ series }: MiniIndicatorHistoryChartProps) {
  const data = series.map((point) => ({
    date: new Date(point.date).getTime(),
    value: typeof point.summary_value === 'number' ? point.summary_value : null,
  }))

  const hasData = data.some((item) => item.value !== null)
  if (!hasData) {
    return <div className={styles.empty}>No recent history</div>
  }
  const tickFormat = getDateTickFormat(data[0].date, data[data.length - 1].date, true)

  return (
    <div className={styles.wrapper}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
          <XAxis
            dataKey="date"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            stroke="transparent"
            tickLine={false}
            axisLine={false}
            minTickGap={24}
            tickFormatter={(value) => format(new Date(value), tickFormat)}
            allowDataOverflow={true}
          />
          <YAxis
            stroke="transparent"
            tickLine={false}
            axisLine={false}
            width={0}
            domain={["auto", "auto"]}
          />
          <Tooltip
            isAnimationActive={false}
            formatter={tooltipFormatter}
            labelFormatter={(label) =>
              typeof label === 'number' ? format(new Date(label), 'PPPP') : label
            }
            cursor={{ stroke: 'rgba(255,255,255,0.2)' }}
            contentStyle={{
              backgroundColor: 'rgba(15, 22, 41, 0.95)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              boxShadow: '0 10px 30px -16px rgba(0,0,0,0.6)',
              color: '#f5f6fb',
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#7aa2ff"
            strokeWidth={1.8}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 1.5, stroke: '#0f1629', fill: '#7aa2ff' }}
            isAnimationActive={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
