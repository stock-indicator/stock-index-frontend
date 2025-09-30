import type { ReactNode } from 'react'
import clsx from 'clsx'

import styles from './Card.module.css'

interface CardProps {
  title?: string
  description?: string
  actions?: ReactNode
  className?: string
  children: ReactNode
}

export function Card({ title, description, actions, className, children }: CardProps) {
  return (
    <section className={clsx(styles.card, className)}>
      {(title || description || actions) && (
        <header className={styles.header}>
          <div className={styles.headerText}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </header>
      )}
      <div className={styles.content}>{children}</div>
    </section>
  )
}
