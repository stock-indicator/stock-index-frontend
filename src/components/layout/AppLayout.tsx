import { NavLink, Outlet } from 'react-router-dom'
import clsx from 'clsx'

import styles from './AppLayout.module.css'

const navLinks = [
  { to: '/', label: 'Dashboard', end: true },
]

export function AppLayout() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandTitle}>Stock Index Dashboard</span>
          <span className={styles.brandSubtitle}>
            Powered by the stock-index-engine API
          </span>
        </div>
        <nav className={styles.nav}>
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(styles.navLink, isActive && styles.navLinkActive)
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <span>Data refreshes via scheduled jobs on the engine backend.</span>
      </footer>
    </div>
  )
}
