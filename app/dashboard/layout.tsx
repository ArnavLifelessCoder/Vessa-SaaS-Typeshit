'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Icon, LogoMark, type IconName } from '@/components/Icon'
import { ToastProvider } from '@/components/Toast'
import { CommandPalette } from '@/components/CommandPalette'
import { ThemeToggle } from '@/components/ThemeToggle'
import { tools } from '@/lib/tools'
import { useCredits } from '@/lib/store'
import styles from './dashboard.module.css'

type NavItem = { href: string; label: string; icon: IconName }

const menuItems: NavItem[] = [{ href: '/dashboard', label: 'Overview', icon: 'grid' }]
const toolItems: NavItem[] = tools.map((t) => ({ href: t.href, label: t.name, icon: t.icon }))
const accountItems: NavItem[] = [{ href: '/dashboard/settings', label: 'Settings', icon: 'settings' }]
const allItems = [...menuItems, ...toolItems, ...accountItems]

function openPalette() {
  window.dispatchEvent(new Event('vessa:open-palette'))
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const credits = useCredits()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const currentLabel = allItems.find((i) => i.href === pathname)?.label ?? 'Dashboard'

  // Close the mobile drawer on route change.
  useEffect(() => setDrawerOpen(false), [pathname])

  const NavLink = ({ item }: { item: NavItem }) => (
    <Link href={item.href} className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}>
      <span className={styles.navIcon}><Icon name={item.icon} size={18} /></span>
      {item.label}
    </Link>
  )

  return (
    <ToastProvider>
      <div className={styles.dashboardShell}>
        {drawerOpen && <div className={styles.drawerScrim} onClick={() => setDrawerOpen(false)} />}

        <aside className={`${styles.sidebar} ${drawerOpen ? styles.sidebarOpen : ''}`}>
          <Link href="/" className={styles.sidebarLogo}>
            <LogoMark size={28} /> <span>Vessa</span>
          </Link>

          <button className={styles.cmdkTriggerFull} onClick={openPalette}>
            <Icon name="search" size={16} />
            <span>Search…</span>
            <kbd className="kbd">⌘K</kbd>
          </button>

          <nav className={styles.sidebarNav}>
            <div className={styles.navSection}>
              <span className={styles.navSectionLabel}>Menu</span>
              {menuItems.map((item) => <NavLink key={item.href} item={item} />)}
            </div>
            <div className={styles.navSection}>
              <span className={styles.navSectionLabel}>AI Tools</span>
              {toolItems.map((item) => <NavLink key={item.href} item={item} />)}
            </div>
            <div className={styles.navSection}>
              <span className={styles.navSectionLabel}>Account</span>
              {accountItems.map((item) => <NavLink key={item.href} item={item} />)}
            </div>
          </nav>

          <div className={styles.usageCard}>
            <div className={styles.usageHeader}>
              <span className={styles.usagePlan}>Free plan</span>
              <Link href="/dashboard/settings" className={styles.upgradeLink}>Upgrade</Link>
            </div>
            <div className={styles.usageBar}>
              <div className={styles.usageFill} style={{ width: `${credits.percent}%` }} />
            </div>
            <span className={styles.usageText}>{credits.used} / {credits.total} AI credits used</span>
          </div>
        </aside>

        <main className={styles.mainContent}>
          <header className={styles.topbar}>
            <div className={styles.topbarLeft}>
              <button className={styles.hamburger} onClick={() => setDrawerOpen(true)} aria-label="Open menu">
                <Icon name="menu" size={20} />
              </button>
              <h3 className={styles.pageTitle}>{currentLabel}</h3>
            </div>
            <div className={styles.topbarRight}>
              <button className="cmdk-trigger" onClick={openPalette}>
                <Icon name="search" size={15} />
                <span className="cmdk-trigger-label">Quick search</span>
                <kbd className="kbd">⌘K</kbd>
              </button>
              <ThemeToggle />
              <span className="badge badge-success"><span className={styles.liveDot} /> AI online</span>
              <div className={styles.avatar}>A</div>
            </div>
          </header>
          <div className={styles.pageContent}>{children}</div>
        </main>

        <CommandPalette />
      </div>
    </ToastProvider>
  )
}
