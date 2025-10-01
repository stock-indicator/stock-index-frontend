import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import clsx from 'clsx'

import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'icon'
}

export function Button({ children, variant = 'default', className, ...props }: PropsWithChildren<ButtonProps>) {
  return (
    <button className={clsx(styles.button, styles[variant], className)} {...props}>
      {children}
    </button>
  )
}
