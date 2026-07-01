'use client'

import Link from 'next/link'
import { Icon } from '@/components/Icon'
import { tools } from '@/lib/tools'
import { useHistory, useCredits, clearHistory } from '@/lib/store'
import { timeAgo } from '@/lib/storage'
import styles from './dashboard.module.css'

export default function DashboardHome() {
  const history = useHistory()
  const credits = useCredits()

  // Roughly 25 minutes saved per successful run.
  const minutesSaved = credits.used * 25
  const timeSaved = minutesSaved >= 60 ? `${(minutesSaved / 60).toFixed(1)}h` : `${minutesSaved}m`

  const stats = [
    { value: String(history.length), label: 'Total runs', icon: 'barChart' as const },
    { value: String(credits.used), label: 'Credits used', icon: 'zap' as const },
    { value: String(credits.remaining), label: 'Credits left', icon: 'sparkle' as const },
    { value: timeSaved, label: 'Time saved', icon: 'clock' as const },
  ]

  return (
    <div className={styles.dashHome}>
      <div className={styles.welcomeCard}>
        <div>
          <h2>Welcome back</h2>
          <p>Pick a tool to get started, or press <kbd className="kbd">⌘K</kbd> to jump anywhere.</p>
        </div>
        <Link href="/dashboard/contract-guard" className="btn btn-primary btn-sm">
          Open ContractGuard <Icon name="arrowRight" size={16} />
        </Link>
      </div>

      <div className={styles.statsRow}>
        {stats.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <span className={styles.statIcon}><Icon name={s.icon} size={18} /></span>
            <div>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {history.length > 0 && (
        <>
          <div className={styles.sectionTitleRow}>
            <h3 className={styles.sectionTitle}>Recent activity</h3>
            <button className="copy-btn" onClick={clearHistory}>
              <Icon name="x" size={14} /> Clear
            </button>
          </div>
          <div className={styles.activityList}>
            {history.slice(0, 6).map((entry) => (
              <Link key={entry.id} href={entry.href} className={styles.activityItem}>
                <span className={styles.activityIcon}><Icon name={entry.icon} size={16} /></span>
                <div className={styles.activityBody}>
                  <span className={styles.activityTool}>{entry.toolName}</span>
                  <span className={styles.activitySummary}>{entry.summary}</span>
                </div>
                <span className={styles.activityTime}>{timeAgo(entry.ts)}</span>
              </Link>
            ))}
          </div>
        </>
      )}

      <h3 className={styles.sectionTitle}>Your tools</h3>
      <div className={styles.toolsGrid}>
        {tools.map((tool) => (
          <div key={tool.id} className={styles.toolCard}>
            <div className={styles.toolCardTop}>
              <span className={styles.toolCardIcon}><Icon name={tool.icon} size={20} /></span>
              <span className="badge badge-neutral">{tool.category}</span>
            </div>
            <h3>{tool.name}</h3>
            <p>{tool.tagline}</p>
            <Link href={tool.href} className="btn btn-secondary btn-sm">
              Launch <Icon name="arrowRight" size={15} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
