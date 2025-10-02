import { useMemo, useState } from 'react'

import type { IndicatorHistoryPoint, IndicatorResult } from '../api/types'
import {
  useBulkIndicatorHistoryQueries,
  useIndicatorsQuery,
  // useManualRefreshMutation,
  useMarketSummaryQuery,
} from '../api/hooks'
import type { FetchHistoryParams } from '../api/queries'
import { IndicatorCard } from '../components/dashboard/IndicatorCard'
// import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { TimeRangePicker } from '../components/ui/TimeRangePicker'
import { TogglePillGroup } from '../components/ui/TogglePillGroup'
import { groupIndicatorsByCategory, sortIndicators } from '../lib/indicators'
import { getLookbackDays, type TimeRangeId } from '../lib/timeRanges'

import styles from './DashboardPage.module.css'

type DashboardViewMode = 'list' | 'category'

const EMPTY_INDICATORS: IndicatorResult[] = []
const DEFAULT_RANGE: TimeRangeId = '1Y'

export function DashboardPage() {
  const [viewMode, setViewMode] = useState<DashboardViewMode>('list')
  const [timeRange, setTimeRange] = useState<TimeRangeId>(DEFAULT_RANGE)

  const {
    data: indicatorsData,
    isLoading: isIndicatorsLoading,
    isError: isIndicatorsError,
  } = useIndicatorsQuery()
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useMarketSummaryQuery()
  // const { mutate: runManualRefresh, isPending: isRefreshing } = useManualRefreshMutation()

  const indicators = indicatorsData?.indicators ?? EMPTY_INDICATORS
  const generatedAt = indicatorsData?.generated_at

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

  const totalIndicators = summaryData?.summary.total_available ?? indicators.length
  const triggeredHigh = summaryData?.summary.triggered_available ?? 0
  const byCategory = summaryData?.summary.by_category ?? {}

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

  const isLoading = isIndicatorsLoading
  const isError = isIndicatorsError

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
          {/* <Button
            variant="icon"
            onClick={() => runManualRefresh()}
            disabled={isRefreshing}
            title="Refresh data"
            className={isRefreshing ? styles.spinning : ''}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="1 4 1 10 7 10"></polyline>
              <polyline points="23 20 23 14 17 14"></polyline>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
          </Button> */}
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
          {isSummaryLoading ? (
            <p className={styles.placeholderCopy}>Loading summary…</p>
          ) : isSummaryError ? (
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
