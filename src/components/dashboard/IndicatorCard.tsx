import { Link } from 'react-router-dom'
import clsx from 'clsx'

import type { IndicatorHistoryPoint, IndicatorResult } from '../../api/types'
import { getIndicatorTone } from '../../lib/indicators'
import { StatusBadge } from '../ui/StatusBadge'
import { MiniIndicatorHistoryChart } from '../charts/MiniIndicatorHistoryChart'

import styles from './IndicatorCard.module.css'

interface IndicatorCardProps {
  indicator: IndicatorResult
  generatedAt?: string
  historySeries?: IndicatorHistoryPoint[]
}

function normaliseRawValue(rawValue?: string | null) {
  if (!rawValue) return null
  return rawValue
}

function renderPureValue(pureValue?: IndicatorResult['pure_value']) {
  if (!pureValue || pureValue.length === 0) return null
  const entries = pureValue.slice(0, 3).map((entry) => {
    const [firstKey, firstValue] = Object.entries(entry)[0] ?? []
    if (firstKey === undefined) return null
    if (typeof firstValue === 'number') {
      return `${firstKey}: ${firstValue.toLocaleString()}`
    }
    return `${firstKey}: ${String(firstValue)}`
  })

  const cleaned = entries.filter(Boolean) as string[]

  if (cleaned.length === 0) return null

  return cleaned.join(' • ')
}

export function IndicatorCard({ indicator, generatedAt, historySeries }: IndicatorCardProps) {
  const tone = getIndicatorTone(indicator.status)
  const toneClassName = `tone${tone.charAt(0).toUpperCase()}${tone.slice(1)}` as keyof typeof styles
  const primaryValue =
    normaliseRawValue(indicator.raw_value)?.replaceAll(';', ' • ') ??
    renderPureValue(indicator.pure_value)

  return (
    <Link to={`/indicator/${indicator.slug}`} className={styles.card}>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <div className={styles.iconCircle} aria-hidden>
            📈
          </div>
          <div>
            <p className={styles.category}>{indicator.category}</p>
            <h3 className={styles.title}>{indicator.name}</h3>
          </div>
        </div>
        <StatusBadge status={indicator.status} />
      </header>
      {indicator.markets?.length ? (
        <div className={styles.marketTags}>
          {indicator.markets.map((market) => (
            <span key={market} className={styles.marketTag}>
              {market}
            </span>
          ))}
        </div>
      ) : null}
      <div className={styles.valueGroup}>
        <p className={clsx(styles.value, styles[toneClassName])}>
          {primaryValue ?? 'No data available'}
        </p>
        {generatedAt && (
          <span className={styles.timestamp}>Updated {new Date(generatedAt).toLocaleString()}</span>
        )}
      </div>
      <div className={styles.chartSection}>
        {historySeries ? (
          <MiniIndicatorHistoryChart series={historySeries} />
        ) : (
          <div className={clsx(styles.chartPlaceholder, styles.toneNeutral)}>
            Loading history…
          </div>
        )}
      </div>
      <footer className={styles.meta}>
        {indicator.threshold && (
          <span className={styles.metaItem}>Threshold: {indicator.threshold}</span>
        )}
        {indicator.topics?.length ? (
          <span className={styles.metaItem}>
            Topics: {indicator.topics.join(', ')}
          </span>
        ) : null}
      </footer>
    </Link>
  )
}
