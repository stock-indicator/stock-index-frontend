import { useMemo, useState } from 'react'

import type { IndicatorResult } from '../api/types'
import { useBulkIndicatorHistoryQueries, useIndicatorsQuery } from '../api/hooks'
import { IndicatorHistoryChart } from '../components/charts/IndicatorHistoryChart'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'
import { TimeRangePicker } from '../components/ui/TimeRangePicker'
import { GRID_CHART_MAX_POINTS, getLookbackDays, type TimeRangeId } from '../lib/timeRanges'

import styles from './AllHistoryPage.module.css'

const DEFAULT_RANGE: TimeRangeId = '1Y'
const EMPTY_INDICATORS: IndicatorResult[] = []

export function AllHistoryPage() {
  const [timeRange, setTimeRange] = useState<TimeRangeId>(DEFAULT_RANGE)
  const indicatorsQuery = useIndicatorsQuery()
  const indicators = indicatorsQuery.data?.indicators ?? EMPTY_INDICATORS
  const generatedAt = indicatorsQuery.data?.generated_at
  const lookbackDays = getLookbackDays(timeRange)

  const historyParams = useMemo(
    () =>
      indicators.map((indicator) => ({
        slug: indicator.slug,
        lookbackDays,
        maxPoints: GRID_CHART_MAX_POINTS,
      })),
    [indicators, lookbackDays],
  )

  const historyQueries = useBulkIndicatorHistoryQueries(
    historyParams,
    indicators.length > 0,
  )

  const combined = indicators.map((indicator, index) => ({
    indicator,
    query: historyQueries[index],
  }))

  const isLoading =
    indicatorsQuery.isLoading ||
    combined.some(({ query }) => query?.isLoading)

  return (
    <div className={styles.wrapper}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>All indicator history</h1>
          <p className={styles.subtitle}>
            Each chart mirrors the indicator detail view and syncs with the global time range selection.
          </p>
          {generatedAt && (
            <p className={styles.subtitleSmall}>
              Last refreshed: {new Date(generatedAt).toLocaleString()}
            </p>
          )}
        </div>
        <div className={styles.controls}>
          <span className={styles.controlLabel}>Time range</span>
          <TimeRangePicker value={timeRange} onChange={setTimeRange} />
        </div>
      </header>

      {indicatorsQuery.isError ? (
        <Card title="Unable to load indicators">
          <p className={styles.errorCopy}>
            The frontend could not fetch the indicator list from the engine.
          </p>
        </Card>
      ) : (
        <div className={styles.grid}>
          {combined.map(({ indicator, query }) => {
            const historySeries = query?.data?.series ?? []
            const status = query?.status ?? 'success'

            return (
              <Card
                key={indicator.slug}
                title={indicator.name}
                description={indicator.category}
                actions={<StatusBadge status={indicator.status} />}
              >
                {status === 'pending' || query?.isLoading ? (
                  <p className={styles.placeholderCopy}>Loading history…</p>
                ) : query?.isError ? (
                  <p className={styles.errorCopy}>
                    No history available for this indicator in the selected window.
                  </p>
                ) : historySeries.length === 0 ? (
                  <p className={styles.placeholderCopy}>
                    No historical points returned for this indicator.
                  </p>
                ) : (
                  <IndicatorHistoryChart series={historySeries} height={240} />
                )}
              </Card>
            )
          })}

          {!isLoading && combined.length === 0 && (
            <Card title="No indicators detected">
              <p className={styles.placeholderCopy}>
                Once the engine publishes indicator results they will appear here.
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
