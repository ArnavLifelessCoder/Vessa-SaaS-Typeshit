import { Icon } from '@/components/Icon'
import { UpgradeButton } from '@/components/UpgradeButton'
import { activeProvider, modelLabel } from '@/lib/ai'
import { getPlan } from '@/lib/plans'
import styles from '../dashboard.module.css'

export default function SettingsPage() {
  const provider = activeProvider()
  const isDemo = provider === 'demo'
  const pro = getPlan('pro')
  const business = getPlan('business')
  return (
    <div className={styles.settingsPage}>
      <h2 style={{ marginBottom: '0.4rem' }}>Settings</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
        Manage your account, subscription, and preferences.
      </p>

      <div className={styles.settingsSection}>
        <h3>Account</h3>
        <div className={styles.settingRow}>
          <span className={styles.settingLabel}>Name</span>
          <span className={styles.settingValue}>Demo User</span>
        </div>
        <div className={styles.settingRow}>
          <span className={styles.settingLabel}>Email</span>
          <span className={styles.settingValue}>demo@vessa.app</span>
        </div>
        <div className={styles.settingRow}>
          <span className={styles.settingLabel}>Member since</span>
          <span className={styles.settingValue}>July 2026</span>
        </div>
      </div>

      <div className={styles.settingsSection}>
        <h3>Subscription</h3>
        <div className={styles.settingRow}>
          <span className={styles.settingLabel}>Current plan</span>
          <span className="badge badge-accent">Free</span>
        </div>
        <div className={styles.settingRow}>
          <span className={styles.settingLabel}>AI credits remaining</span>
          <span className={styles.settingValue}>13 / 20</span>
        </div>
        <div className={styles.settingRow}>
          <span className={styles.settingLabel}>Billing cycle</span>
          <span className={styles.settingValue}>—</span>
        </div>
        <div className={styles.planActions}>
          <UpgradeButton planId="pro" className="btn btn-primary btn-sm">
            <Icon name="zap" size={15} /> Upgrade to Pro — {pro?.priceLabel}/mo
          </UpgradeButton>
          <UpgradeButton planId="business" className="btn btn-outline btn-sm">
            Go Business — {business?.priceLabel}/mo
          </UpgradeButton>
        </div>
      </div>

      <div className={styles.settingsSection}>
        <h3>Usage this month</h3>
        <div className={styles.settingRow}>
          <span className={styles.settingLabel}>Contract reviews</span>
          <span className={styles.settingValue}>3 / 5</span>
        </div>
        <div className={styles.settingRow}>
          <span className={styles.settingLabel}>Content generations</span>
          <span className={styles.settingValue}>7 / 10</span>
        </div>
        <div className={styles.settingRow}>
          <span className={styles.settingLabel}>Workflow generations</span>
          <span className={styles.settingValue}>2 / 3</span>
        </div>
      </div>

      <div className={styles.settingsSection}>
        <h3>AI configuration</h3>
        <div className={styles.settingRow}>
          <span className={styles.settingLabel}>AI provider</span>
          <span className={`badge ${isDemo ? 'badge-success' : 'badge-accent'}`}>
            {isDemo ? 'Demo mode' : 'Live'}
          </span>
        </div>
        <div className={styles.settingRow}>
          <span className={styles.settingLabel}>Model</span>
          <span className={styles.settingValue}>{modelLabel()}</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '0.75rem' }}>
          {isDemo ? (
            <>
              You&apos;re on <strong>free demo mode</strong> — tools return realistic simulated output at $0 cost.
              For real AI at no cost, add a free <code>GEMINI_API_KEY</code> (Google AI Studio) or{' '}
              <code>GROQ_API_KEY</code> (Groq) to <code>.env.local</code>. Set <strong>both</strong> and every
              request runs on both models in parallel, returning the stronger answer automatically.
            </>
          ) : (
            <>All nine tools are running live on {modelLabel()}. Remove the key from <code>.env.local</code> to return to free demo mode.</>
          )}
        </p>
      </div>

      <div className={styles.settingsSection} style={{ borderColor: 'hsla(0, 72%, 60%, 0.18)' }}>
        <h3 style={{ color: 'var(--danger)' }}>Danger zone</h3>
        <div className={styles.settingRow}>
          <div>
            <span className={styles.settingLabel}>Delete account</span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
              Permanently delete your account and all data. This cannot be undone.
            </p>
          </div>
          <button className="btn btn-danger btn-sm">Delete</button>
        </div>
      </div>
    </div>
  )
}
