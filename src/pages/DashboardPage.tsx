import { useMemo, useState } from 'react'

import type { IndicatorHistoryPoint, IndicatorResult } from '../api/types'
import {
  useBulkIndicatorHistoryQueries,
  useIndicatorsQuery,
  useMarketSummaryQuery,
} from '../api/hooks'
import type { FetchHistoryParams } from '../api/queries'
import { IndicatorCard } from '../components/dashboard/IndicatorCard'
import { Card } from '../components/ui/Card'
import { TimeRangePicker } from '../components/ui/TimeRangePicker'
import { TogglePillGroup } from '../components/ui/TogglePillGroup'
import { groupIndicatorsByCategory, sortIndicators } from '../lib/indicators'
import { getLookbackDays, type TimeRangeId } from '../lib/timeRanges'

import styles from './DashboardPage.module.css'

type DashboardViewMode = 'list' | 'category'

const EMPTY_INDICATORS: IndicatorResult[] = []
const DEFAULT_RANGE: TimeRangeId = '3M'

export function DashboardPage() {
  const [viewMode, setViewMode] = useState<DashboardViewMode>('list')
  const [timeRange, setTimeRange] = useState<TimeRangeId>(DEFAULT_RANGE)

  const indicatorsQuery = useIndicatorsQuery()
  const summaryQuery = useMarketSummaryQuery()

  const indicators = indicatorsQuery.data?.indicators ?? EMPTY_INDICATORS
  const generatedAt = indicatorsQuery.data?.generated_at

  const sortedIndicators = useMemo(
    () => [...indicators].sort(sortIndicators),
    [indicators],
  )

  const groupedByCategory = useMemo(
    () => groupIndicatorsByCategory(sortedIndicators),
    [sortedIndicators],
  )

  const categories = useMemo(
    () =>
      Object.entries(groupedByCategory).sort(([categoryA], [categoryB]) =>
        categoryA.localeCompare(categoryB),
      ),
    [groupedByCategory],
  )

  const totalIndicators = summaryQuery.data?.summary.total_available ?? indicators.length
  const triggeredHigh = summaryQuery.data?.summary.triggered_available ?? 0
  const byCategory = summaryQuery.data?.summary.by_category ?? {}

  const lookbackDays = getLookbackDays(timeRange)
  const historyParams = useMemo<FetchHistoryParams[]>(
    () =>
      sortedIndicators.reduce<FetchHistoryParams[]>((acc, indicator) => {
        if (indicator.slug) {
          acc.push({ slug: indicator.slug, lookbackDays })
        }
        return acc
      }, []),
    [sortedIndicators, lookbackDays],
  )

  const historyQueries = useBulkIndicatorHistoryQueries(historyParams, historyParams.length > 0)
  const historyBySlug = useMemo(() => {
    const map = new Map<string, IndicatorHistoryPoint[]>()
    historyParams.forEach((param, index) => {
      const query = historyQueries[index]
      if (query?.data) {
        map.set(param.slug, query.data.series ?? [])
      }
    })
    return map
  }, [historyParams, historyQueries])

  const isLoading = indicatorsQuery.isLoading
  const isError = indicatorsQuery.isError

  return (
    <div className={styles.wrapper}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Market overview</h1>
          <p className={styles.subtitle}>
            Live indicator readings from the engine with drilldowns and full history views.
          </p>
        </div>
        <div className={styles.headerControls}>
          <TimeRangePicker value={timeRange} onChange={setTimeRange} />
          <TogglePillGroup
            options={[
              { value: 'list', label: 'Ungrouped' },
              { value: 'category', label: 'By category' },
            ]}
            value={viewMode}
            onChange={setViewMode}
          />
        </div>
      </header>

      <section className={styles.summaryRow}>
        <Card
          title="Signal snapshot"
          description={
            generatedAt
              ? `Latest run: ${new Date(generatedAt).toLocaleString()}`
              : undefined
          }
        >
          {summaryQuery.isLoading ? (
            <p className={styles.placeholderCopy}>Loading summary…</p>
          ) : summaryQuery.isError ? (
            <p className={styles.errorCopy}>Unable to load summary stats right now.</p>
          ) : (
            <div className={styles.summaryContent}>
              <div className={styles.summaryHeadline}>
                <div>
                  <p className={styles.headlineLabel}>Total indicators</p>
                  <p className={styles.headlineValue}>{totalIndicators}</p>
                </div>
                <div>
                  <p className={styles.headlineLabel}>Triggered (high)</p>
                  <p className={styles.headlineValueHighlight}>{triggeredHigh}</p>
                </div>
              </div>
              <div className={styles.summaryBreakdown}>
                {Object.entries(byCategory).map(([category, breakdown]) => (
                  <div key={category} className={styles.summaryPill}>
                    <span className={styles.summaryPillLabel}>{category}</span>
                    <span className={styles.summaryPillValue}>
                      H: {breakdown.high} | N: {breakdown.normal} | U: {breakdown.unavailable}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </section>

      <section className={styles.contentSection}>
        {isLoading ? (
          <Card title="Loading indicators" description="Fetching latest run…">
            <p className={styles.placeholderCopy}>Please wait while we collect live data.</p>
          </Card>
        ) : isError ? (
          <Card title="Unable to load indicators" description="Check engine API">
            <p className={styles.errorCopy}>
              The frontend could not contact the engine service. Ensure it is running at the configured base URL.
            </p>
          </Card>
        ) : sortedIndicators.length === 0 ? (
          <Card title="No indicators found">
            <p className={styles.placeholderCopy}>
              Once the engine produces outputs they will appear here automatically.
            </p>
          </Card>
        ) : viewMode === 'list' ? (
          <div className={styles.indicatorGrid}>
            {sortedIndicators.map((indicator) => (
              <IndicatorCard
                key={indicator.slug}
                indicator={indicator}
                generatedAt={generatedAt}
                historySeries={indicator.slug ? historyBySlug.get(indicator.slug) : undefined}
              />
            ))}
          </div>
        ) : (
          <div className={styles.categoryStack}>
            {categories.map(([categoryName, categoryIndicators]) => (
              <div key={categoryName} className={styles.categoryGroup}>
                <div className={styles.categoryHeader}>
                  <h2>{categoryName}</h2>
                  <span>{categoryIndicators.length} indicators</span>
                </div>
                <div className={styles.indicatorGrid}>
                  {categoryIndicators.map((indicator) => (
                    <IndicatorCard
                      key={indicator.slug}
                      indicator={indicator}
                      generatedAt={generatedAt}
                      historySeries={indicator.slug ? historyBySlug.get(indicator.slug) : undefined}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}



