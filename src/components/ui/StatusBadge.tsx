import clsx from 'clsx'
import type { IndicatorStatus } from '../../api/types'
import { formatIndicatorStatus, getIndicatorTone } from '../../lib/indicators'

import styles from './StatusBadge.module.css'

interface StatusBadgeProps {
  status?: IndicatorStatus | null
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const tone = getIndicatorTone(status)

  return (
    <span className={clsx(styles.badge, styles[tone])}>
      {formatIndicatorStatus(status)}
    </span>
  )
}
