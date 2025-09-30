import type { ReactNode } from 'react'
import clsx from 'clsx'

import styles from './TogglePillGroup.module.css'

export interface ToggleOption<TValue extends string> {
  value: TValue
  label: string
  helper?: ReactNode
}

interface TogglePillGroupProps<TValue extends string> {
  options: ToggleOption<TValue>[]
  value: TValue
  onChange: (value: TValue) => void
}

export function TogglePillGroup<TValue extends string>({
  options,
  value,
  onChange,
}: TogglePillGroupProps<TValue>) {
  return (
    <div className={styles.group}>
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            className={clsx(styles.option, isActive && styles.active)}
            onClick={() => onChange(option.value)}
          >
            <span>{option.label}</span>
            {option.helper && (
              <span className={styles.helper}>{option.helper}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
